import { Entity, Column, PrimaryGeneratedColumn,  ManyToOne, JoinColumn } from "typeorm"
import { Tours } from "./Tours"

export enum LangTypes {
English = "English",
Spanish = "Spanish",
French = "French",
German = "German",
Mandarin = "Mandarin",
Russian = "Russian",
Arabic = "Arabic",
Finnish = " Finnish",
Swedish = "Swedish"
}

@Entity()
export class TourLanguages {
    @PrimaryGeneratedColumn()
    langID: number

    @Column ("nvarchar")
    language: LangTypes

    @Column ("int")
    guideID: number

    @JoinColumn({name : "tourID"})
    @ManyToOne(() => Tours, (tour) => tour.lang, { onDelete: 'CASCADE' })
    tour: Tours

}