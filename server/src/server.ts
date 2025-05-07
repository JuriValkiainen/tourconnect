import { AppDataSource } from "./data-source";
import { Tours } from "./entities/Tours";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

import { initializeDatabase } from "./initializeData";
initializeDatabase();

import guidesRouter from "./endpoints/guidesEndpoints";
import touristsRouter from "./endpoints/touristsEndpoints";
import excursionsRouter from "./endpoints/excursionsEndpoints";
import adminRouter from "./endpoints/adminEndpoints";


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.get("/", (req, res) => {
  res.send("TourConnect API is running...");
});

app.use("/", guidesRouter);
app.use("/", touristsRouter);
app.use("/", excursionsRouter);
app.use("/", adminRouter);

export function verifyToken(req: Request, res: Response, next: NextFunction, roleToCheck: string) {
  const token = req.header("Authorization")?.replace("Bearer ", "").trim();
  if (!token) {
    return res.status(401).json({ error: " Access denied " });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const existingRole = decoded["role"];
    if (existingRole != roleToCheck) {
      return res.status(401).json({ error: " Access denied " });
    }
    req.user = {
      id: decoded["id"],
      email: decoded["email"],
      role: decoded["role"],
    };
    
    next();
  } catch (error) {
    res.status(401).json({ error: " Invalid token" });
  }
}

export function verifyGuideToken(req: Request, res: any, next: NextFunction) {
  verifyToken(req, res, next, "guide")
}


export function verifyTouristToken(req: Request, res: any, next: NextFunction) {
  verifyToken(req, res, next, "tourist")
}

export function verifyAdminToken(req: Request, res: any, next: NextFunction) {
  verifyToken(req, res, next, "admin")
}

app.get("/cities", async (req, res) => {
  const cities = await AppDataSource.manager.find(Tours, {
    select: { city: true },
  });
  const cityList = cities.map((c) => c.city);
  const uniqueCities = Array.from(new Set(cityList));
  console.log(JSON.stringify(uniqueCities, null, 2));
  res.json(uniqueCities);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
