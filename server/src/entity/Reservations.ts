import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm"

import {Tourists} from "./Tourists"
import { Tours } from "./Tours"
import { Reviews } from "./Reviews"

@Entity()
export class Reservations {
    @PrimaryGeneratedColumn()
    reservID: number

    @Column ("int")
    touristID: number

    @Column ("int")
    tourID: number

    @Column("nvarchar", {length: 10})
    bill: number

    @Column("date")   //(YYYY-MM-DD)
    data: string

    @JoinColumn({name : "touristID"})
    @ManyToOne(() => Tourists, (tourists)=>tourists.reservations)
    tourist:Tourists

    @JoinColumn({name : "tourID"})
    @ManyToOne(() => Tours, (tours)=>tours.reservations)
    tours:Tours

    @OneToOne(() => Reviews, (reviews) =>reviews.reserv)
    reviews: Reviews
}