import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm"
import { OneToMany, JoinTable, Index, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Group } from "./group.entity"
import { Photo } from "./photo.entity"
import * as bcrypt from "bcrypt"

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  @Index({ unique: true })
  username!: string

  @Column()
  fullName!: string

  @Column({ nullable: true })
  @Index({ unique: true })
  email!: string

  @Column({ select: false, nullable: true })
  passwordHash!: string

  @ManyToMany(() => Group, (role) => role.users, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  })
  @JoinTable({
    name: "userGroups",
    joinColumn: { name: "userId" },
    inverseJoinColumn: { name: "groupId" }
  })
  groups!: Group[]

  @OneToMany(() => Photo, (photo) => photo.user)
  photos!: Photo[]

  @UpdateDateColumn()
  updatedAt!: Date

  @CreateDateColumn()
  createAt!: Date

  @Column({ default: true })
  isActive!: boolean

  setPassword(pass: string) {
    const salt = bcrypt.genSaltSync(10)
    this.passwordHash = bcrypt.hashSync(pass, salt)
  }

  veryfyPassword(pass: string) {
    return (
      !this.passwordHash || this.passwordHash == "" || bcrypt.compareSync(pass, this.passwordHash)
    )
  }
}
