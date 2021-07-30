import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user";

@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.photos)
    user!: User;

    @Column()
    url!: string;

}