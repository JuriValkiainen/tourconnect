import { Entity, Column, PrimaryGeneratedColumn, 
    ManyToOne, OneToMany,
    JoinColumn, } from "typeorm"

import { Guides } from "./Guides"
import { Reservations } from "./Reservations"

export enum TourType {
    Walk = "Walk",  
    Food = "Food",
    Museum = "Museum",
    History = "History",
    Outdoor = "Outdoor",
    Kids = "Kids"

}
@Entity()
export class Tours {
    @PrimaryGeneratedColumn()
    tourID: number

    @Column("nvarchar", {length: 20,})
    city: string

    @Column("nvarchar")
    type: TourType

    @Column("int", {nullable: true })
    pricePerPerson: number

    @Column("int", {nullable: true })
    maxPerson: number

    @Column("nvarchar", {length: 4000,})
    description: string

    @Column("nvarchar", {nullable: true })
    picture: string

    @ManyToOne(() => Guides, (guide) => guide.tours, { onDelete: 'CASCADE' })
    @JoinColumn({name : "guideID"})
    guide: Guides

    @OneToMany(() => Reservations, (reserv) => reserv.tours, { nullable: false })
    reservations: Reservations[]
 

}



