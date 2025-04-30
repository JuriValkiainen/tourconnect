import { Tourists } from "../entities/Tourists";
import { AppDataSource } from "../data-source";
import { Reservations } from "../entities/Reservations";
import { Router, Request, Response } from 'express';
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { verifyTouristToken } from '../server';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import crypto from 'crypto';
import { Reviews } from "../entities/Reviews";

const router = Router();

// Настройка nodemailer для отправки электронной почты
// console.log("EMAIL CONFIG:", {
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   user: process.env.EMAIL_USER,
//   pass: process.env.EMAIL_PASS,
// });
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: Number(process.env.EMAIL_PORT),
//   secure: false, // Mailtrap использует незащищенное соединение по порту 2525
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// } as SMTPTransport.Options);
// Looking to send emails in production? Check out our Email API/SMTP product!
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "fad364f84916f0",
    pass: "a33f8c8ffb10ea"
  }
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

          const touristRepo = AppDataSource.getRepository(Tourists);

          const existingUserE = await touristRepo.findOne({ where: { email: reqData.email } });
          if (existingUserE) {
            return res.status(400).json({ error: "Email already registered" });
          }

          const existingUserP = await touristRepo.findOne({ where: { phone: reqData.phone } });
          if (existingUserP) {
            return res.status(400).json({ error: "Phone already registered" });
          }


    const hashedPassword = await bcrypt.hash(reqData.password, 10);
    const verificationToken = generateVerificationToken();

    const newTourist = touristRepo.create({
      firstName: reqData.firstName,
      lastName: reqData.lastName,
      password: hashedPassword,
      phone: reqData.phone,
      email: reqData.email,
      isVerified: false,
      verificationToken,
    });

    const result = await touristRepo.save(newTourist);

    const token = jwt.sign(
      { id: result.touristID, email: result.email, role: "tourist" },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: 'Регистрация успешна. Вы вошли в аккаунт.',
      token,
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})

//--Запрос на повторную верификацию (по кнопке на клиенте)
router.post("/verify-request", verifyTouristToken, async (req: Request, res: any) => {
  try {
    console.log("verify-request endpoint called", req.user);
    const { id: touristID } = req.user as { id: number; email: string };

    const touristRepo = AppDataSource.getRepository(Tourists);
    const tourist = await touristRepo.findOne({ where: { touristID } });
    console.log("tourist найден в запросе на верификацию: ", tourist);
    if (!tourist) {
      return res.status(404).json({ error: "User not found" });
    }

    if (tourist.isVerified) {
      return res.status(400).json({ error: "Email already verified" });
    }

    // Обновляем или оставляем текущий токен
    if (!tourist.verificationToken) {
      tourist.verificationToken = generateVerificationToken();
      await touristRepo.save(tourist);
    }

    const now = new Date();
    console.log('lastVerificationEmailSent у найденного туриста:', tourist.lastVerificationEmailSent);
    console.log('typeof lastVerificationEmailSent:', typeof tourist.lastVerificationEmailSent);
    if (tourist.lastVerificationEmailSent && (now.getTime() - new Date(tourist.lastVerificationEmailSent).getTime()) < 1 * 60 * 1000) {
      return res.status(429).json({ error: "Письмо уже было отправлено недавно. Пожалуйста, подождите." });
    }

    tourist.lastVerificationEmailSent = now;
    await touristRepo.save(tourist);

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${tourist.verificationToken}`;

    const mailOptions = {
      from: `"TourConnect" <${process.env.EMAIL_USER}>`,
      to: tourist.email,
      subject: 'Подтверждение электронной почты',
      html: `<p>Для подтверждения email нажмите <a href="${verificationLink}">здесь</a>.</p>`,
    };
    console.log("Отправка письма на почту по эндпойнту /verify-request:", mailOptions);
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Ошибка при отправке письма:', error);
        return res.status(500).json({ error: "Ошибка при отправке письма" });
      } else {
        console.log('Письмо отправлено:', info.response);
        res.status(200).json({ message: "Письмо с подтверждением отправлено на почту" });
      }
    });

  } catch (error) {
    console.error("Ошибка верификации запроса:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
      // res.redirect(`${process.env.FRONTEND_URL}/email-verified`);
      // Или можно отправить JSON-ответ:
      res.status(200).json({ message: "Email успешно верифицирован" });

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
      email: tourist.email,
      isVerified: tourist.isVerified,
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

// Удаление туриста
     router.delete("/api/tourists/me", verifyTouristToken, async (req: Request, res: any) => {
       try {
         const { id: touristID } = req.user as { id: number; email: string; role: string };
               
         if (!touristID) {
           return res.status(401).json({ error: 'Unauthorized' });
         }
         
         const touristRepo = AppDataSource.getRepository(Tourists);
         const reviewsRepo = AppDataSource.getRepository(Reviews);
     
         const tourist = await touristRepo.findOne({
           where: { touristID: touristID },
         });
     
         if (!tourist) {
           return res.status(403).json({ error: "Tourist not found or you do not have permission to delete it" });
         }
     
         const fallbackTourist = await touristRepo.findOne({ where: { touristID: 1 } });
         if (!fallbackTourist) {
           return res.status(400).json({ error: "Fallback tourist with ID 1 not found" });
         }

         await reviewsRepo
         .createQueryBuilder()
         .update()
         .set({ tourist: fallbackTourist })
         .where("touristID = :id", { id: touristID })
         .execute();

         await touristRepo.remove(tourist);
     
         return res.status(200).json({ success: true});
       
       } catch (error) {
         console.error("Error while deleting the tour:", error);
         res.status(500).json({ error: "Internal server error" });
       }
     });

     // Удаление бронирования
     router.delete("/api/bookings/me/:reservID", verifyTouristToken, async (req: Request, res: any) => {
       try {
         const { id: touristID } = req.user as { id: number; email: string; role: string };
               
         if (!touristID) {
           return res.status(401).json({ error: 'Unauthorized' });
         }
         
         const reservID = parseInt(req.params.reservID);
         if (isNaN(reservID)) {
           return res.status(400).json({ error: "Invalid reservID" });
         }
     
         const reservRepo = AppDataSource.getRepository(Reservations);
     
         const reserv = await reservRepo.findOne({
           where: { reservID: reservID, tourist: { touristID: touristID } },
         });
     
         if (!reserv) {
           return res.status(403).json({ error: "Reservation not found or you do not have permission to delete it" });
         }
     
         await reservRepo.remove(reserv);
     
         return res.status(200).json({ success: true});
       
       } catch (error) {
         console.error("Error while deleting the reservation:", error);
         res.status(500).json({ error: "Internal server error" });
       }
     });
     


export default router;