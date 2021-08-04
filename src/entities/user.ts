import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, Index } from "typeorm";
import { Profile } from "./profile";
import { Photo } from "./photo";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @Index({ unique: true })
    userName!: string;

    @Column()
    fullName!: string;

    @Column({ select: false, nullable: true })
    password!: string;

    @OneToOne(() => Profile)
    @JoinColumn()
    profile!: Profile;

    @OneToMany(() => Photo, photo => photo.user)
    photos!: Photo[];

    @Column({ default: false })
    isActive!: boolean;

}