import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Profile } from "./profile";
import { Photo } from "./photo";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userName!: string;

    @Column()
    fullName!: string;

    @OneToOne(() => Profile)
    @JoinColumn()
    profile!: Profile;

    @OneToMany(() => Photo, photo => photo.user)
    photos!: Photo[];

    @Column({ default: false })
    isActive!: boolean;

}