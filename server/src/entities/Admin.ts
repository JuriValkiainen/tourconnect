import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  adminID: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: "admin" })
  role: string;
}