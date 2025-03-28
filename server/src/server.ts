import { Tourists } from "./entity/Tourists";
import { AppDataSource } from "./data-source";
//import express, { Express, Request, Response, Application } from 'express';
import { Tours } from "./entity/Tours";
import { Guides } from "./entity/Guides";

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

//-------------------GET--------------------------
app.get("/cities", async (req, res) => {
    const cities = await AppDataSource.manager.find(Tours, {select: { city: true }} );
    const cityList = cities.map(c => c.city);
    console.log(JSON.stringify(cities, null, 2))
    res.json(cityList)
});

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
        next();
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


//-------------------POST--------------------------
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
    newGuides.email = reqData.email;
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

interface CreateToursRequest
{
    city: string
    type: string
    maxPerson: number
    pricePerPerson: number
    description: string
    picture: string
    }

app.post("/excursions", verifyGuideToken, async (req: Request, res: any) => {
    try {
        const reqData = req.body as CreateToursRequest
        
        if (!reqData.city || !reqData.type || !reqData.maxPerson|| !reqData.pricePerPerson|| !reqData.description|| !reqData.picture) {
            return res.status(400).json({ error: "All fields are required" });
          }
    const newTours = await AppDataSource.getRepository(Tours).create()
    newTours.city = reqData.city
    newTours.type = reqData.type
    newTours. maxPerson = reqData.maxPerson
    newTours.pricePerPerson = reqData.pricePerPerson
    newTours.description = reqData.description
    newTours.picture = reqData.picture

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





app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});