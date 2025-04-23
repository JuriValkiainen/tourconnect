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

    @Column("int", {nullable: true })
    summa: number

    @Column("int")
    numberOfPeople: number

    @Column("date")   //(YYYY-MM-DD)
    date: Date

    @JoinColumn({name : "touristID"})
    @ManyToOne(() => Tourists, (tourists)=>tourists.reservations, { onDelete: 'CASCADE' })
    tourist:Tourists

    @JoinColumn({name : "tourID"})
    @ManyToOne(() => Tours, (tours)=>tours.reservations)
    tours:Tours

    @OneToOne(() => Reviews, (reviews) =>reviews.reserv)
    reviews: Reviews
}