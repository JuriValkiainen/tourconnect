import { Tourists } from "./entity/Tourists";
import { AppDataSource } from "./data-source";

import { Tours } from "./entity/Tours";
import { Guides } from "./entity/Guides";
import { FindOptionsWhere } from "typeorm";

import cors from "cors";
import { Reservations } from "./entity/Reservations";

import express, { Request, Response, NextFunction } from 'express';

 
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

import { initializeDatabase } from "./initializeData";
initializeDatabase(); 

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.get("/", (req, res) => {
    res.send("TourConnect API is running...");
});

//---------------- function to verify JWT tokens----------

function  verifyGuideToken (req: Request, res: any, next : NextFunction) { 
  const token = req.header ('Authorization')?.replace("Bearer ", "").trim(); 
  if (!token) {
       return res.status(401).json ( { error : ' Access denied ' } ) ; 
      }
        try { 
          const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
          const role = decoded["role"]
          if (role != "guide") {
                  return res.status(401).json ( { error : ' Access denied ' } ) ; 
                 }

          req.user = {
          id: decoded['id'],  
          email: decoded['email'],
          role: decoded['role']
          }

          next()
      }    
  
      catch ( error ) {
       res.status ( 401 ) .json ( { error : ' Invalid token' } );
       } 
      }; 
  
  
  function  verifyTouristToken (req: Request, res: any, next : NextFunction) { 
  const token = req.header ('Authorization')?.replace("Bearer ", "").trim(); 
      if (!token) {
           return res.status(401).json ( { error : ' Access denied ' } ) ; 
           }
          
          try { 
                  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
                  const role = decoded["role"]
  
                  if (role != "tourist") {
                          return res.status(401).json ( { error : ' Access denied ' } ) ; 
                         }
                  next();
              }    
          
          catch ( error ) {
               res.status ( 401 ) .json ( { error : error} );
              }
           }; 
  

app.get("/cities", async (req, res) => {
    const cities = await AppDataSource.manager.find(Tours, {select: { city: true }} );
    const cityList = cities.map(c => c.city);
    console.log(JSON.stringify(cities, null, 2))
    res.json(cityList)
});

// Список всех экскурсий
app.get("/excursions", async (req, res) => {
    const { city, type } = req.query; 
    const filters: any = {};
    if (city) filters.city = city;  
    if (type) filters.type = type;  
    try {
            const tours = await AppDataSource.manager.find(Tours, {
            where: filters
        });
        res.json(tours);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching excursions." });
    }
});

// Экскурсия по id
app.get("/excursions/:id",  async (req: Request<{ id: number }>, res: any) => { 
    const { id } = req.params;
    try {
      const tour = await AppDataSource.manager.findOne(Tours, {
        where: { tourID: id }
      });
  
      if (!tour) {
        return res.status(404).json({ error: "Tour not found" });
      }
  
      res.json(tour);
    } catch (error) {
      console.error("Error fetching tour:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

//Возвращает профиль гида
  app.get('/api/guides/me', verifyGuideToken, async (req: Request, res: any) => {
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
      //relations: ['tours', 
       // 'lang', 'reviews'] 
      })
      if (!guide) {
        return res.status(404).json({ error: 'Guide not found' });
      }

      const profil = {Name: guide.firstName, 
        LastName: guide.lastName, 
        Phone: guide.phone, 
        email: guide.email, 
        description: guide.description, 
        photo: guide.photo}

      res.json(profil);

  } catch (error) {
    console.error('Error fetching guide:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Возвращает список экскурсий данного гида
  app.get('/api/guides/:guideID/tours', verifyGuideToken, async (req: Request, res: any) => {
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
  app.get('/api/guides/:guideID/bookings', verifyGuideToken, async (req: Request, res: any) => {
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

// Бронирование экскурсий
interface CreateReservationRequest
{
    tourID: number
    touristID: number
    date: string
    numberOfPeople: number
    summa: number
}

app.post("/booking", verifyTouristToken, async (req: Request, res: any) => {
    
        try {
        const reqData = req.body as CreateReservationRequest
        
        if (!reqData.tourID || !reqData.touristID || !reqData.date || !reqData.numberOfPeople|| !reqData.summa) {
            return res.status(400).json({ error: "All fields are required" });
          }
          const parsedDate = new Date(reqData.date);
          if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ error: "Invalid date format" });
          }
      
          if (reqData.numberOfPeople <= 0) {
            return res.status(400).json({ error: "Number of people must be greater than zero" });
          }

    const newReservation = await AppDataSource.getRepository(Reservations).create()
    newReservation.touristID = reqData.touristID
    newReservation.tourID = reqData.tourID
    newReservation.date = parsedDate
    newReservation.numberOfPeople = reqData.numberOfPeople
    newReservation.summa = reqData.summa

    const result = await AppDataSource.getRepository(Reservations).save(newReservation)
    res.json({
        id : result.reservID
    })
    }
    catch (error) {
        console.error("Error creating reservation:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

//регистрация туриста
interface CreateRegisterRequest
{
    firstName: string
    lastName: string
    password: string
    phone: string
    email: string
    }

app.post("/register", async (req: Request, res: any) => {
   
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

//регистрация гида
interface CreateGuideRegisterRequest
{
    firstName: string
    lastName: string
    email: string
    password: string
    phone: string
    description: string
    photo: string
    }

app.post("/guides/register", async (req: Request, res: any) => {
   
    try {
        const reqData = req.body as CreateGuideRegisterRequest
        
        if (!reqData.firstName || !reqData.lastName || !reqData.password|| !reqData.phone|| !reqData.description|| !reqData.email) {
            return res.status(400).json({ error: "All fields are required" });
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
        
    const newGuides = await AppDataSource.getRepository(Guides).create()
    newGuides.firstName = reqData.firstName
    newGuides.lastName = reqData.lastName
    newGuides.password = hashedPassword
    newGuides.phone = reqData.phone
    newGuides.description = reqData.description
    newGuides.photo = reqData.photo
    newGuides.email = reqData.email

    const result = await AppDataSource.getRepository(Guides).save(newGuides)
    
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }

      const token = jwt.sign(
        { id: result.guideID, email: result.email, role: "guide" },
        jwtSecret
      );
   
      res.status(201).json({token});
   
    }
    
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

// Oбновление данных личного кабинета гида
type UpdateGuideRegisterRequest = Omit<CreateGuideRegisterRequest, "password">
  
app.put("/api/guides/me", verifyGuideToken, async (req: Request, res: any) => {

try {
    const { id: guideID } = req.user as { id: number; email: string; role: string }
          
    if (!guideID) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
    const reqData = req.body as UpdateGuideRegisterRequest
    
    if (!reqData.firstName || !reqData.lastName || !reqData.phone|| !reqData.description|| !reqData.email) {
        return res.status(400).json({ error: "All fields are required" });
      }  
      
    const guideRepo = AppDataSource.getRepository(Guides);
    const guide = await guideRepo.findOne({ where: { guideID } });

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
return res.status(200).json({ success: true });
  }

catch (error) {
  console.error("Registration error:", error);
  return res.status(500).json({ error: "Internal server error" });
}
})

//Аутентификация гида
  interface CreateGuideLoginRequest
  {
      email: string
      password: string
      }

      app.post("/guides/login", async (req: Request, res: any) => {
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

// Cоздание экскурсии
interface CreateToursRequest
{
    city: string
    type: string
    maxPerson: number
    pricePerPerson: number
    description: string
    picture: string
    guideID: number
    }

app.post("/api/tours", verifyGuideToken, async (req: Request, res: any) => {
    try {

      const { id: guideID } = req.user as { id: number; email: string; role: string }
            
      if (!guideID) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
        const reqData = req.body as CreateToursRequest
        
        if (!reqData.city || !reqData.type || !reqData.maxPerson|| !reqData.pricePerPerson|| !reqData.description|| !reqData.picture) {
            return res.status(400).json({ error: "All fields are required" });
          }

          const guide = await AppDataSource.getRepository(Guides).findOne({ where: { guideID } });
    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    const newTours = await AppDataSource.getRepository(Tours).create()
    newTours.city = reqData.city
    newTours.type = reqData.type
    newTours. maxPerson = reqData.maxPerson
    newTours.pricePerPerson = reqData.pricePerPerson
    newTours.description = reqData.description
    newTours.picture = reqData.picture
    newTours.guide = guide

    const result = await AppDataSource.getRepository(Tours).save(newTours)
    res.json({
        id : result.tourID
    })
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

//Редактирование экскурсий
type UpdateToursRequest = Omit<CreateToursRequest, "guideID">
  
app.put("/api/tours/:tourID", verifyGuideToken, async (req: Request, res: any) => {
  try {
    const { id: guideID } = req.user as { id: number; email: string; role: string }
          
    if (!guideID) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const tourID = parseInt(req.params.tourID);

  if (isNaN(tourID)) {
    return res.status(400).json({ error: "Invalid tour ID" });
  }
    const reqData = req.body as UpdateToursRequest  

    if (!reqData.city || !reqData.type || !reqData.maxPerson|| !reqData.pricePerPerson|| !reqData.description|| !reqData.picture) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const tourRepo = AppDataSource.getRepository(Tours);
    const tour = await tourRepo.findOne({ where: { tourID: tourID,  guide: { guideID: guideID }} as FindOptionsWhere<Tours> 
     });

    if (!tour) {
      return res.status(403).json({ error: "Tour not found or you do not have permission to edit it" });
    }

    tour.city = reqData.city
    tour.type = reqData.type
    tour. maxPerson = reqData.maxPerson
    tour.pricePerPerson = reqData.pricePerPerson
    tour.description = reqData.description
    tour.picture = reqData.picture

    await tourRepo.save(tour)
    return res.status(200).json({ success: true })
  
}
    catch (error) {
        console.error("Registration error:", error)
        res.status(500).json({ error: "Internal server error" })
    }
})  
  
// Удаление экскурсии
app.delete("/api/tours/:tourID", verifyGuideToken, async (req: Request, res: any) => {
  try {
    const { id: guideID } = req.user as { id: number; email: string; role: string };
          
    if (!guideID) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const tourID = parseInt(req.params.tourID);
    if (isNaN(tourID)) {
      return res.status(400).json({ error: "Invalid tour ID" });
    }

    const tourRepo = AppDataSource.getRepository(Tours);

    const tour = await tourRepo.findOne({
      where: { tourID: tourID, guide: { guideID: guideID } },
    });

    if (!tour) {
      return res.status(403).json({ error: "Tour not found or you do not have permission to delete it" });
    }

    await tourRepo.remove(tour);

    return res.status(200).json({ success: true});
  
  } catch (error) {
    console.error("Error while deleting the tour:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});