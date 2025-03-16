import { Entity, Column, PrimaryGeneratedColumn, ManyToOne,
    JoinColumn, 
    OneToOne} from "typeorm"

import { Guides } from "./Guides"
import { Tourists } from "./Tourists"
import { Reservations } from "./Reservations"

@Entity()
export class Reviews {
    @PrimaryGeneratedColumn()
    rewiewID: number

    @Column ("int")
    touristID: number

    @Column ("int")
    guideID: number

    @Column ("int")
    reservID: number

    @Column("text", {nullable: true })
    review: string

    @Column("int")
    rating: number

    @JoinColumn({name : "guideID"})
    @ManyToOne(() => Guides, (guide) => guide.reviews)
    guide: Guides

    @JoinColumn({name : "touristID"})
    @ManyToOne(() => Tourists, (tourists) => tourists.reviews)
    tourist:Tourists

    @JoinColumn({name : "reservID"})
    @OneToOne(() => Reservations, (reserv) => reserv.reviews)
    reserv: Reservations
}

