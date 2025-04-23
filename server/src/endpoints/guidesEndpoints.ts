import { AppDataSource } from "../data-source";
import { Guides } from "../entities/Guides";
import { Languages, LangTypes } from '../entities/Languages';
import { Router, Request, Response } from 'express';
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { verifyGuideToken } from '../server';


const router = Router();
 
//Регистрация гида
interface CreateGuideRegisterRequest
{
    firstName: string
    lastName: string
    email: string
    password: string
    phone: string
    description: string
    photo: string
    languages: LangTypes[]
    }
router.post("/guides/register", async (req: Request, res: any) => {
   
    try {
        const reqData = req.body as CreateGuideRegisterRequest
        
        const isValidLang = (value: unknown): value is LangTypes =>
          Object.values(LangTypes).includes(value as LangTypes);
    
        if (!reqData.firstName || !reqData.lastName || !reqData.phone|| 
          !reqData.description|| !reqData.email|| !Array.isArray(reqData.languages) ||
          reqData.languages.length === 0 ||
          !reqData.languages.every(isValidLang)) {
            return res.status(400).json({ error: "All fields are required and languages must be valid" });
          }  
          
          const existingUserE = await AppDataSource.getRepository(Guides).findOne({ where: { email: reqData.email } });
          if (existingUserE) {
            return res.status(400).json({ error: "A user with this email is already registered" });
          }

          const existingUserP = await AppDataSource.getRepository(Guides).findOne({ where: { phone: reqData.phone } });
          if (existingUserP) {
            return res.status(400).json({ error: "A user with this phone is already registered" });
          }

    const hashedPassword = await bcrypt.hash(reqData.password, 10);
        
    const guideRepo = AppDataSource.getRepository(Guides);
    const newGuide = guideRepo.create({
      firstName: reqData.firstName,
      lastName: reqData.lastName,
      password: hashedPassword,
      phone: reqData.phone,
      description: reqData.description,
      photo: reqData.photo,
      email: reqData.email
    });
    const savedGuide = await guideRepo.save(newGuide);

const languageRepo = AppDataSource.getRepository(Languages);
const languageEntities = reqData.languages.map((lang: LangTypes) => {
  const langEntity = new Languages();
  langEntity.language = lang;
  langEntity.guide = savedGuide;
  return langEntity;
});

await languageRepo.save(languageEntities);
    
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }

      const token = jwt.sign(
        { id: savedGuide.guideID, email: savedGuide.email, role: "guide" },
        jwtSecret
      );
   
      res.status(201).json({token});
    }
    
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

// Получить список доступных языков
router.get("/languages", async (req: Request, res: Response) => {
  const languages = Object.values(LangTypes);
  res.json(languages); 
});

//Аутентификация гида
interface CreateGuideLoginRequest
{
    email: string
    password: string
    }
    router.post("/guides/login", async (req: Request, res: any) => {
      try {
      const { email, password } = req.body as CreateGuideLoginRequest

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const guideRepo = AppDataSource.getRepository(Guides)
      const guide = await guideRepo.findOne({ where: { email } })

      if (!guide || !(await bcrypt.compare(password, guide.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ error: 'Internal server error' });
    }

    const token = jwt.sign(
      { id: guide.guideID,
        email: guide.email,
        role: 'guide' },
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

//Возвращает профиль гида
router.get('/api/guides/me', verifyGuideToken, async (req: Request, res: any) => {
  try {

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id: guideID } = req.user as { id: number; email: string; role: string }
    
    if (!guideID) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const guideRepo = AppDataSource.getRepository(Guides);

    const guide = await guideRepo.findOne({where: { guideID },
    relations: [
    // 'tours', 
      'lang', 
     // 'reviews'
     ] 
    })
    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    const profile = {name: guide.firstName, 
      lastName: guide.lastName, 
      phone: guide.phone, 
      email: guide.email, 
      description: guide.description, 
      photo: guide.photo,
      languages: guide.lang.map(l => l.language)
    }

    return res.json(profile);

} catch (error) {
  console.error('Error fetching guide:', error);
  res.status(500).json({ error: 'Internal server error' });
}
});

// Oбновление данных личного кабинета гида
type UpdateGuideRegisterRequest = Omit<CreateGuideRegisterRequest, "password">
  router.put("/api/guides/me", verifyGuideToken, async (req: Request, res: any) => {

try {
    const { id: guideID } = req.user as { id: number; email: string; role: string }
          
    if (!guideID) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
    const reqData = req.body as UpdateGuideRegisterRequest
    const isValidLang = (value: unknown): value is LangTypes =>
      Object.values(LangTypes).includes(value as LangTypes);

    if (!reqData.firstName || !reqData.lastName || !reqData.phone|| 
      !reqData.description|| !reqData.email|| !Array.isArray(reqData.languages) ||
      reqData.languages.length === 0 ||
      !reqData.languages.every(isValidLang)) {
        return res.status(400).json({ error: "All fields are required and languages must be valid" });
      }  
      
    const guideRepo = AppDataSource.getRepository(Guides);
    const languageRepo = AppDataSource.getRepository(Languages);

    const guide = await guideRepo.findOne({ where: { guideID },  relations: ["lang"], });
    if (!guide) {
    return res.status(404).json({ error: "Guide not found" });
    }

    if (reqData.email && reqData.email !== guide.email) {
      const existingUserE = await guideRepo.findOne({ where: { email: reqData.email } });
      if (existingUserE) {
          return res.status(400).json({ error: "A user with this email is already registered" });
      }
  }

  if (reqData.phone && reqData.phone !== guide.phone) {
      const existingUserP = await guideRepo.findOne({ where: { phone: reqData.phone } });
      if (existingUserP) {
          return res.status(400).json({ error: "A user with this phone is already registered" });
      }
  }
 
guide.firstName = reqData.firstName
guide.lastName = reqData.lastName
guide.phone = reqData.phone
guide.description = reqData.description
guide.photo = reqData.photo
guide.email = reqData.email

await guideRepo.save(guide);

if (guide.lang?.length) {
  await languageRepo.remove(guide.lang);
}

const languageEntities = reqData.languages.map((lang: LangTypes) => {
  const langEntity = new Languages();
  langEntity.language = lang;
  langEntity.guide = guide;
  return langEntity;
});

await languageRepo.save(languageEntities);

return res.status(200).json({ success: true });
  }

catch (error) {
  console.error("Registration error:", error);
  return res.status(500).json({ error: "Internal server error" });
}
})

//Возвращает список экскурсий данного гида
router.get('/api/guides/:guideID/tours', verifyGuideToken, async (req: Request, res: any) => {
  try {
    const { id: guideID } = req.user as { id: number; email: string; role: string }
    
    if (!guideID) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const guideRepo = AppDataSource.getRepository(Guides);
    const guide = await guideRepo.findOne({ where: { guideID }, relations: ['tours'] });

    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    res.json(guide.tours);
  } catch (error) {
    console.error('Error fetching tours:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Возвращает список бронирований данного гида
   router.get('/api/guides/:guideID/bookings', verifyGuideToken, async (req: Request, res: any) => {
       try {
         const { id: guideID } = req.user as { id: number; email: string; role: string }
         
         if (!guideID) {
           return res.status(401).json({ error: 'Unauthorized' })
         }
     
         const guideRepo = AppDataSource.getRepository(Guides)
         const guide = await guideRepo.findOne({ 
           where: { guideID }, 
           relations: ['tours', 'tours.reservations', 'tours.reservations.tourist']
          });
     
         if (!guide) {
           return res.status(404).json({ error: 'Guide not found' })
         }
   
         const bookings = guide.tours.flatMap(tour => 
           tour.reservations.map(reservation => { 
             const tourist = reservation.tourist || {}
             return {
           tourName: tour.city,
           touristsfirstName: `${reservation.tourist.firstName}`,
           touristslastName: `${reservation.tourist.lastName}`,
           touristsEmail: reservation.tourist.email,  
           touristsPhone: reservation.tourist.phone,  
           reservationDate: reservation.date,  
           numberOfPeople: reservation.numberOfPeople,  
           summa: reservation.summa  
         }
       })
     )
         res.json(bookings)
       } catch (error) {
         console.error('Error fetching tours:', error)
         res.status(500).json({ error: 'Internal server error' })
       }
     });

     // Удаление гида
     router.delete("/api/guides/me", verifyGuideToken, async (req: Request, res: any) => {
       try {
         const { id: guideID } = req.user as { id: number; email: string; role: string };
               
         if (!guideID) {
           return res.status(401).json({ error: 'Unauthorized' });
         }
         
         const guideRepo = AppDataSource.getRepository(Guides);
     
         const guide = await guideRepo.findOne({
           where: { guideID: guideID },
         });
     
         if (!guide) {
           return res.status(403).json({ error: "Guide not found or you do not have permission to delete it" });
         }
     
         await guideRepo.remove(guide);
     
         return res.status(200).json({ success: true});
       
       } catch (error) {
         console.error("Error while deleting the tour:", error);
         res.status(500).json({ error: "Internal server error" });
       }
     });
    
 export default router;