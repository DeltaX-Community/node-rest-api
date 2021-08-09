import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm"
import { User } from "./user"

@Entity({ name: "photos" })
export class Photo {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => User, (user) => user.photos)
  user!: User

  @Column()
  url!: string

  @CreateDateColumn()
  createAt!: Date

  @Column({ default: true })
  isActive!: boolean
}
