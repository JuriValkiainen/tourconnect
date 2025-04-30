import { Router, Request, Response } from 'express';
import { AppDataSource } from "../data-source";
import { Admin } from "../entities/Admin";
import { Subscribers } from "../entities/Subscribers";
import { ContactMessages } from "../entities/ContactMessages";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyAdminToken } from "../server";

const router = Router();

router.post("/admin-login", async (req: Request, res: any) => {
  const { email, password } = req.body;
  const admin = await AppDataSource.getRepository(Admin).findOneBy({ email });

  if (!admin) return res.status(401).json({ error: "Invalid email or password" });

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return res.status(401).json({ error: "Invalid email or password" });

  const token = jwt.sign(
    { id: admin.adminID, email: admin.email, role: "admin" },
    process.env.JWT_SECRET as string,
    { expiresIn: "12h" }
  );

  res.json({ token });
});

router.get("/admin/subscribers", verifyAdminToken, async (req: Request, res: any) => {
  const subscribers = await AppDataSource.getRepository(Subscribers).find();
  res.json(subscribers);
});

router.get("/admin/messages", verifyAdminToken, async (req: Request, res: any) => {
  const messages = await AppDataSource.getRepository(ContactMessages).find();
  res.json(messages);
});

export default router;