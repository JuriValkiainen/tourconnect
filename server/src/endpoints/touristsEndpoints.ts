import { Tourists } from "../entitys/Tourists";
import { AppDataSource } from "../data-source";
import { Reservations } from "../entitys/Reservations";
import { Router, Request, Response } from 'express';
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { verifyTouristToken } from '../server'

const router = Router();

//Регистрация туриста
interface CreateRegisterRequest
{
    firstName: string
    lastName: string
    password: string
    phone: string
    email: string
    }
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

    const newTourists = await AppDataSource.getRepository(Tourists).create()
    newTourists.firstName = reqData.firstName
    newTourists.lastName = reqData.lastName
    newTourists.password = hashedPassword
    newTourists.phone = reqData.phone
    newTourists.email = reqData.email

    const result = await AppDataSource.getRepository(Tourists).save(newTourists)

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }

      const token = jwt.sign(
        { id: result.touristID, email: result.email, role: "tourist" },
        jwtSecret
      );
   
      res.status(201).json({token});
   
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

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
      return res.status(401).json({ error: 'Unauthorized111' });
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

    const profil = {firstName: tourist.firstName, 
      lastName: tourist.lastName, 
      phone: tourist.phone, 
      email: tourist.email
      }

    res.json(profil);

} catch (error) {
  console.error('Error fetching tourist:', error);
  res.status(500).json({ error: 'Internal server error' });
}
});

//Возвращает список бронирований данного туриста
router.get('/api/tourists/:touristID/booking', verifyTouristToken, async (req: Request, res: any) => {
  try {
    const { id: touristID } = req.user as { id: number; email: string; role: string }
    
    if (!touristID) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
   
    const reservRepo = AppDataSource.getRepository(Reservations);
    const reservations = await reservRepo.find({
      where: { touristID },
      relations: ['tours','tours.guide'], 
    })

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

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;