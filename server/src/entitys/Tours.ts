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
    pricePerPerson: number

    @Column("int", {nullable: true })
    maxPerson: number

    @Column("nvarchar", {length: 4000,})
    description: string

    @Column("nvarchar", {nullable: true })
    picture: string

    @ManyToOne(() => Guides, (guide) => guide.tours)
    @JoinColumn({name : "guideID"})
    guide: Guides

    @OneToMany(() => Reservations, (reserv) => reserv.tours, { nullable: false })
    reservations: Reservations[]
 

}



