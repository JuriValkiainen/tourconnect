import { Entity, PrimaryGeneratedColumn, Column, OneToMany,
    JoinColumn } from "typeorm"
    
import { Reservations } from "./Reservations"

@Entity()
export class Tourists {

    @PrimaryGeneratedColumn()
    touristID: number

    @Column("nvarchar", {length: 50,})
    firstName: string

    @Column("nvarchar", {length: 50, nullable: true })
    lastName: string

    @Column("nvarchar", {length: 10,})
    password: string

    @Column("int")
    phone: number
   
    @JoinColumn({name : "touristID"})
    @OneToMany(() => Reservations, (reserv) => reserv.tourist)
    reservations: Reservations[]

    @JoinColumn({name : "touristID"})
    @OneToMany(() => Reservations, (reserv) => reserv.tourist)
    reviews: Reservations[]
}
