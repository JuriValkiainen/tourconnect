import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class ContactUs {
  @PrimaryGeneratedColumn()
  contactID: number;

  @Column("nvarchar", { length: 255, unique: true })
  email: string;

  @Column("nvarchar", {length: 50})
  firstName: string;

  @Column("nvarchar", {length: 50})
  lastName: string;

  @Column("nvarchar", {length: 4000}) 
  message: string
  
}