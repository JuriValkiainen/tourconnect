import { Tourists } from "../entities/Tourists";
import { AppDataSource } from "../data-source";
import { Reservations } from "../entities/Reservations";
import { Router, Request, Response } from 'express';
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { verifyTouristToken } from '../server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const router = Router();

// Настройка nodemailer (заменить на данные Gmail в .env файле)
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
  },
});

// Функция для генерации случайного токена
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

//----------Регистрация туриста-----------
// Интерфейс для запроса регистрации
interface CreateRegisterRequest
{
    firstName: string
    lastName: string
    password: string
    phone: string
    email: string
    }
/**
 * @route POST /api/auth/register
 * @description Регистрация нового туриста.
 * @access Public
 */
router.post("/register", async (req: Request, res: any) => {
   
    try {
        const reqData = req.body as CreateRegisterRequest
        
        if (!reqData.firstName || !reqData.lastName || !reqData.password|| !reqData.phone|| !reqData.email) {
            return res.status(400).json({ error: "All fields are required" });
          }

          const existingUserE = await AppDataSource.getRepository(Tourists).findOne({ where: { email: reqData.email } });
          if (existingUserE) {
            return res.status(400).json({ error: "A user with this email is already registered" });
          }
          const existingUserP = await AppDataSource.getRepository(Tourists).findOne({ where: { phone: reqData.phone } });
          if (existingUserP) {
            return res.status(400).json({ error: "A user with this phone is already registered" });
          }

    const hashedPassword = await bcrypt.hash(reqData.password, 10);
    const verificationToken = generateVerificationToken();

    const newTourist = await AppDataSource.getRepository(Tourists).create({
      firstName: reqData.firstName,
      lastName: reqData.lastName,
      password: hashedPassword,
      phone: reqData.phone,
      email: reqData.email,
      isVerified: false,
      verificationToken: verificationToken,
    });

    const result = await AppDataSource.getRepository(Tourists).save(newTourist)

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }

    const token = jwt.sign(
      { id: result.touristID, 
        email: result.email, 
        role: "tourist" },
        jwtSecret
    );

    // Отправка письма с верификацией
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: reqData.email,
        subject: 'Подтверждение адреса электронной почты',
        html: `<p>Пожалуйста, перейдите по <a href="${verificationLink}">этой ссылке</a> для подтверждения вашего адреса электронной почты.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error('Ошибка при отправке письма верификации:', error);
          // TODO: Рассмотреть стратегию обработки ошибки отправки (например, повторная попытка, логирование, уведомление администратора)
      } else {
          console.log('Письмо верификации отправлено:', info.response);
      }
  });
   
      res.status(201).json({ message: 'Регистрация прошла успешно. Пожалуйста, проверьте свою электронную почту для подтверждения.', token});
   
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

/**
 * @route GET /api/auth/verify-email
 * @description Верификация электронной почты пользователя по токену.
 * @access Public
 */
router.get("/verify-email", async (req: Request, res: any) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: "Неверный токен верификации" });
  }

  try {
      const tourist = await AppDataSource.getRepository(Tourists).findOne({ where: { verificationToken: token } });

      if (!tourist) {
          return res.status(404).json({ error: "Неверный или устаревший токен верификации" });
      }

      tourist.isVerified = true;
      tourist.verificationToken = ""; // Очищаем токен после успешной верификации
      await AppDataSource.getRepository(Tourists).save(tourist);

      // Перенаправление пользователя на страницу успешной верификации на фронтенде
      res.redirect(`${process.env.FRONTEND_URL}/email-verified`);
      // Или можно отправить JSON-ответ:
      // res.status(200).json({ message: "Email успешно верифицирован" });

  } catch (error) {
      console.error("Ошибка верификации email:", error);
      res.status(500).json({ error: "Внутренняя ошибка сервера при верификации email" });
  }
});


//Аутентификация туриста
interface CreateTouristLoginRequest
{
    email: string
    password: string
    }
 router.post("/tourists/login", async (req: Request, res: any) => {
      try {
      const { email, password } = req.body as CreateTouristLoginRequest

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const touristRepo = AppDataSource.getRepository(Tourists)
      const tourist = await touristRepo.findOne({ where: { email } })

      if (!tourist || !(await bcrypt.compare(password, tourist.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ error: 'Internal server error' });
    }

    const token = jwt.sign(
      { id: tourist.touristID,
        email: tourist.email,
        role: 'tourist' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.json({ token })
}

 catch (error) {
  console.error('Login error:', error)
  res.status(500).json({ error: 'Internal server error' });
}
})

//Возвращает профиль туриста
router.get('/api/tourists/me', verifyTouristToken, async (req: Request, res: any) => {
  try {

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized!' });
    }

    const { id: touristID } = req.user as { id: number; email: string; role: string }
    
    if (!touristID) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const touristRepo = AppDataSource.getRepository(Tourists);

    const tourist = await touristRepo.findOne({where: { touristID }

    })
    if (!tourist) {
      return res.status(404).json({ error: 'Profil not found' });
    }

    const profile = {
      touristID: tourist.touristID,
      firstName: tourist.firstName, 
      lastName: tourist.lastName, 
      phone: tourist.phone, 
      email: tourist.email
      }
      console.log('profile is created in endpoint /api/tourists/me: ', profile);
    res.json(profile);

} catch (error) {
  console.error('Error fetching tourist:', error);
  res.status(500).json({ error: 'Internal server error' });
}
});

//Возвращает список бронирований данного туриста
router.get('/api/tourists/booking', verifyTouristToken, async (req: Request, res: any) => {
  try {
    const { id: touristID } = req.user as { id: number; email: string; role: string }
    console.log('req.user in /api/tourists/booking:', req.user); // Убедитесь, что req.user есть
    console.log('touristID in /api/tourists/booking:', touristID); // Убедитесь, что ID правильный
    if (!touristID) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
   
    const reservRepo = AppDataSource.getRepository(Reservations);
    console.log('Попытка найти бронирования для touristID:', touristID); // Проверьте ID перед запросом

    const reservations = await reservRepo.find({
      where: { touristID },
      relations: ['tours','tours.guide'], 
    })
    console.log('reservations in endpoint /api/tourists/booking: ', reservations);
    const bookings = reservations.map(reservation => ({
      reservID: reservation.reservID,
      guideFirstName: reservation.tours?.guide?.firstName,
      guideLastName: reservation.tours?.guide?.lastName,
      tourType: reservation.tours?.type, 
      city: reservation.tours?.city,
      date: reservation.date,
      numberOfPeople: reservation.numberOfPeople,
      summa: reservation.summa,
    }));
    console.log('Преобразованные бронирования:', bookings); // Посмотрите на результат map

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;