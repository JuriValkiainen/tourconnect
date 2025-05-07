import { Router, Request, Response } from 'express';
import { AppDataSource } from "../data-source";
import { Admin } from "../entities/Admin";
import { Subscribers } from "../entities/Subscribers";
import { ContactMessages } from "../entities/ContactMessages";
// import { Subscribers } from "../entities/Subscribers";
// import { Subscribers } from "../entities/Subscribers";
// import { ContactMessages } from "../entities/ContactMessages";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyAdminToken } from "../server";

const router = Router();
interface CreateAdminLoginRequest
{
    email: string
    password: string
}

router.post("/api/admin-login", async (req: Request, res: any) => {
  const { email, password } = req.body as CreateAdminLoginRequest;
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
  console.log("admin's email: ", email);

  const allAdmins = await AppDataSource.getRepository(Admin).find();
  console.log("All admins in DB:", allAdmins);

  const normalizedEmail = email.trim().toLowerCase();
  const admin = await AppDataSource.getRepository(Admin).findOneBy({ email: normalizedEmail });
  console.log("admin: ", admin);
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
console.log("admin endpoints loaded")
// router.get("/admin/subscribers", verifyAdminToken, async (req: Request, res: any) => {
//   const subscribers = await AppDataSource.getRepository(Subscribers).find();
//   res.json(subscribers);
// });

// router.get("/admin/messages", verifyAdminToken, async (req: Request, res: any) => {
//   const messages = await AppDataSource.getRepository(ContactMessages).find();
//   res.json(messages);
// });


  interface CreateSubscribersRequest
  {
      firstName: string
      lastName: string
      email: string
      }
  
  router.post("/api/admin/subscribers", async (req: Request, res: any) => {
     
      try {
          const reqData = req.body as CreateSubscribersRequest
          
          if (!reqData.email) {
              return res.status(400).json({ error: "All fields are required" });
            }
  
            const subscriberRepo = AppDataSource.getRepository(Subscribers);
  
            const existingUserE = await subscriberRepo.findOne({ where: { email: reqData.email } });
            if (existingUserE) {
              return res.status(400).json({ error: "Email already registered" });
            }
  
      const newSubscriber = subscriberRepo.create({
        email: reqData.email,
      });
  
      const result = await subscriberRepo.save(newSubscriber);
      return res.status(200).json({ success: true });

    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  })


  interface CreateContactUsRequest
  {
      firstName: string
      lastName: string
      email: string
      message: string
      }

  router.post("/api/admin/contact-us", async (req: Request, res: any) => {
     
    try {
        const reqData = req.body as CreateContactUsRequest
        
        if (!reqData.firstName || !reqData.lastName || !reqData.email || !reqData.message) {
            return res.status(400).json({ error: "All fields are required" });
          }

          const contactRepo = AppDataSource.getRepository(ContactMessages);

        const existingUser = await contactRepo.findOne({ where: {
            email: reqData.email, message: reqData.message}});
          if (existingUser) {
            return res.status(400).json({ error: "You have already sent this message" });
          }  

    const newContact = contactRepo.create({
      firstName: reqData.firstName,
      lastName: reqData.lastName,
      email: reqData.email,
      message: reqData.message

    });

    const result = await contactRepo.save(newContact);
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})

router.get("/api/admin/subscribers", verifyAdminToken, async (req: Request, res: any) => {
  const subscribersRepo = AppDataSource.getRepository(Subscribers);
  const subscribers = await subscribersRepo.find();
  res.json(subscribers); 
});

router.get("/api/admin/messages", verifyAdminToken, async (req: Request, res: any) => {
  const messagesRepo = AppDataSource.getRepository(ContactMessages);
  const messages = await messagesRepo.find();
  res.json(messages); 
});

export default router;