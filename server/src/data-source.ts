import "reflect-metadata"
import { DataSource } from "typeorm"
import { Guides } from "./entity/Guides"
import { Tourists } from "./entity/Tourists"
import { Languages } from "./entity/Languages"
import { Reservations } from "./entity/Reservations"
import { Reviews } from "./entity/Reviews"
import { Tours } from "./entity/Tours"

export const AppDataSource = new DataSource({
    type: "mssql",
    //TODO: add database connection settings !!!
    host: "",
    username: "",
    password: "",
    database: "",
    synchronize: true,
    options : {
        trustServerCertificate : true
    },
    logging: true,
    entities: [Tourists, Guides, Languages, Reservations, Reviews, Tours],
    subscribers: [],
    migrations: [],
})
