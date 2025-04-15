import { Entity, Column, PrimaryGeneratedColumn, OneToMany,
    JoinColumn, } from "typeorm"

import { Tours } from "./Tours"
import { Languages } from "./Languages"
import { Reviews } from "./Reviews"

@Entity()
export class Guides {
    @PrimaryGeneratedColumn()
    guideID: number

    @Column("nvarchar", {length: 50})
    firstName: string

    @Column("nvarchar", {length: 50})
    lastName: string

    @Column("nvarchar", { length: 50, nullable: true })
    email: string

    @Column("nvarchar", { length: 512, nullable: true})
    password: string

    @Column("nvarchar", {length: 50, nullable: true })
    phone: string

    @Column("nvarchar", {length: 4000}) 
    description: string

    @Column("text", {nullable: true })
    photo: string

    @OneToMany(() => Tours, (tour)=> tour.guide)
    tours: Tours[]

    @OneToMany(() => Languages, (lang)=> lang.guide)
    lang: Languages[]

    @OneToMany(() => Reviews, (review)=> review.guide)
    reviews: Reviews[]
}

