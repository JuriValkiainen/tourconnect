import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class ContactMessages {
  @PrimaryGeneratedColumn()
  contactID: number;

  @Column("nvarchar", { length: 255})
  email: string;

  @Column("nvarchar", {length: 50})
  firstName: string;

  @Column("nvarchar", {length: 50})
  lastName: string;

  @Column("nvarchar", {length: 4000}) 
  message: string
  
}