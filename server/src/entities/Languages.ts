import { Entity, Column, PrimaryGeneratedColumn,  ManyToOne, JoinColumn } from "typeorm"
import { Guides } from "./Guides"

export enum LangTypes {
English = "English",
Spanish = "Spanish",
French = "French",
German = "German",
Mandarin = "Mandarin",
Russian = "Russian",
Arabic = "Arabic"
}

@Entity()
export class Languages {
    @PrimaryGeneratedColumn()
    langID: number

    @Column ("nvarchar")
    language: LangTypes

    @Column ("int")
    guideID: number

    @JoinColumn({name : "guideID"})
    @ManyToOne(() => Guides, (guide) => guide.lang, { onDelete: 'CASCADE' })
    guide: Guides

}