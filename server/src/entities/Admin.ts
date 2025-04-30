import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  adminID: number;

  @Column("nvarchar", { length: 255, unique: true })
  email: string;

  @Column("nvarchar", { length: 255, unique: true })
  password: string;

  @Column("nvarchar", { default: "admin" })
  role: string;
}