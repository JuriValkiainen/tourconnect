import { AppDataSource } from "./data-source";
import { Tours } from "./entitys/Tours";
import cors from "cors";
import express, { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

import { initializeDatabase } from "./initializeData";
initializeDatabase(); 

import guidesRouter from './endpoints/guidesEndpoints'
import touristsRouter from './endpoints/touristsEndpoints'
import excursionsRouter from './endpoints/excursionsEndpoints'

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.get("/", (req, res) => {
    res.send("TourConnect API is running...");
});

app.use('/', guidesRouter);
app.use('/', touristsRouter);
app.use('/', excursionsRouter);

export function  verifyGuideToken (req: Request, res: any, next : NextFunction) { 
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
export function  verifyTouristToken (req: Request, res: any, next : NextFunction) { 
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

            req.user = {
            id: decoded['id'],  
            email: decoded['email'],
            role: decoded['role']
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});