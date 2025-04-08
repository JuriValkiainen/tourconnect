import { Entity, PrimaryGeneratedColumn, Column, OneToMany,
    JoinColumn } from "typeorm"
    
import { Reservations } from "./Reservations"
import { Reviews } from "./Reviews"

@Entity()
export class Tourists {

    @PrimaryGeneratedColumn()
    touristID: number

    @Column("nvarchar", {length: 50,})
    firstName: string

    @Column("nvarchar", {length: 50, nullable: true })
    lastName: string

    @Column("nvarchar", { length: 255, nullable: true })
    email: string

    @Column("nvarchar", {length: 255, nullable: true})
    password: string

    @Column("nvarchar",  {nullable: true })
    phone: string

    @Column({ type: "bit", default: false })
    isVerified: boolean

    @Column("varchar", {length: 512, nullable: true })
    verificationToken: string
    
    @OneToMany(() => Reservations, (reserv) => reserv.tourist)
    reservations: Reservations[]

    @OneToMany(() => Reviews, (reserv) => reserv.tourist)
    reviews: Reviews[]
}
