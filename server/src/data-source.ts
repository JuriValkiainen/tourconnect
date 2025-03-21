import "reflect-metadata"
import { DataSource } from "typeorm"
import { config } from "dotenv";
import { Guides } from "./entity/Guides"
import { Tourists } from "./entity/Tourists"
import { Languages } from "./entity/Languages"
import { Reservations } from "./entity/Reservations"
import { Reviews } from "./entity/Reviews"
import { Tours } from "./entity/Tours"

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
