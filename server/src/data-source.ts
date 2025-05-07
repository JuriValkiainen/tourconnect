import "reflect-metadata"
import { DataSource } from "typeorm"
import { config } from "dotenv";
import { Guides } from "./entities/Guides"
import { Tourists } from "./entities/Tourists"
import { Languages } from "./entities/Languages"
import { Reservations } from "./entities/Reservations"
import { Reviews } from "./entities/Reviews"
import { Tours } from "./entities/Tours"
import { TourLanguages } from "./entities/TourLanguages";
import { Admin } from "./entities/Admin";
import { ContactMessages} from "./entities/ContactMessages";
import { Subscribers } from "./entities/Subscribers";

// Loading environment variables from .env file
config();

export const AppDataSource = new DataSource({
    type: "mssql",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    options : {
        trustServerCertificate : true
    },
    logging: true,
    entities: [Tourists, Guides, Languages, Reservations,
    Reviews, Tours, Admin, TourLanguages, ContactMessages, Subscribers],
    subscribers: [],
    migrations: [],
})
