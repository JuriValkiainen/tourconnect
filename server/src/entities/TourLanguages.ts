import { Entity, Column, PrimaryGeneratedColumn,  ManyToOne, JoinColumn } from "typeorm"
import { Tours } from "./Tours"

export enum TourLangTypes {
English = "English",
Spanish = "Spanish",
French = "French",
German = "German",
Mandarin = "Mandarin",
Russian = "Russian",
Arabic = "Arabic",
Finnish = "Finnish",
Swedish = "Swedish"
}

@Entity()
export class TourLanguages {
    @PrimaryGeneratedColumn()
    tourlangID: number

    @Column ("nvarchar")
    tourlanguage: TourLangTypes

    @JoinColumn({name : "tourID"})
    @ManyToOne(() => Tours, (tour) => tour.tourlang, { onDelete: 'CASCADE' })
    tour: Tours

}