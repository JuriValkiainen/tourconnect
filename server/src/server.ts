import { Tourists } from "./entity/Tourists";
import { AppDataSource } from "./data-source";
import express, { Express, Request, Response , Application } from 'express';

//import cors from "cors";
//import dotenv from "dotenv";

//dotenv.config();

AppDataSource.initialize().then(async () => {

    console.log("Inserting a new user into the database...")
    const user = new Tourists()
    user.touristID = 1
    user.firstName = "Timber"
    user.lastName = "Saw"
    user.password = "Saw"
   
    await AppDataSource.manager.save(user)


    
    console.log("Saved a new user with id: " + user.touristID)

    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(Tourists)
    console.log("Loaded users: ", users)

    console.log("Here you can setup and run express / fastify / any other framework.")

}).catch((error: any) => console.log(error))



const app = express();
//app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.get("/", (req, res) => {
    res.send("TourConnect API is running...");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});