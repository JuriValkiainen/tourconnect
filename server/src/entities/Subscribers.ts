import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Subscribers {
  @PrimaryGeneratedColumn()
  subscribID: number;

  @Column("nvarchar", { length: 255, unique: true })
  email: string;
  
}