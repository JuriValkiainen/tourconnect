import { Entity, Column, PrimaryGeneratedColumn,  ManyToOne,
    JoinColumn } from "typeorm"

    import { Guides } from "./Guides"

@Entity()
export class Languages {

@PrimaryGeneratedColumn()
langID: number

@Column ("nvarchar", {length: 50})
language: string

@Column ("int")
guideID: number

 @JoinColumn({name : "guideID"})
    @ManyToOne(() => Guides, (guide) => guide.lang)
    guide: Guides

}