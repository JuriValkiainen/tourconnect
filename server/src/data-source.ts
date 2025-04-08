import "reflect-metadata"
import { DataSource } from "typeorm"
import { config } from "dotenv";
import { Guides } from "./entitys/Guides"
import { Tourists } from "./entitys/Tourists"
import { Languages } from "./entitys/Languages"
import { Reservations } from "./entitys/Reservations"
import { Reviews } from "./entitys/Reviews"
import { Tours } from "./entitys/Tours"

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
    entities: [Tourists, Guides, Languages, Reservations, Reviews, Tours],
    subscribers: [],
    migrations: [],
})
