import { Entity, Column, PrimaryGeneratedColumn, 
    ManyToOne, OneToMany,
    JoinColumn, } from "typeorm"

import { Guides } from "./Guides"
import { Reservations } from "./Reservations"

@Entity()
export class Tours {
    @PrimaryGeneratedColumn()
    tourID: number

    @Column("nvarchar", {length: 20,})
    city: string

    @Column("nvarchar")
    type: string

    @Column("int", {nullable: true })
    prisePerPerson: number

    @Column("int", {nullable: true })
    maxPerson: number

    @Column("nvarchar", {length: 4000,})
    description: string

    @Column("nvarchar", {nullable: true })
    picture: string

    @JoinColumn({name : "guideID"})
    @ManyToOne(() => Guides, (guide) => guide.tours)
    guide: Guides

    @JoinColumn({name : "tourID"})
    @OneToMany(() => Reservations, (reserv) => reserv.tours, { nullable: false })
    reservations: Reservations[]
 

}



