import { Entity, PrimaryGeneratedColumn, Index, Column, CreateDateColumn } from "typeorm"

@Entity({ name: "profiles" })
export class Profile {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  @Index({ unique: true })
  name!: string

  @Column()
  description!: string

  @CreateDateColumn()
  createAt!: Date

  @Column({ default: true })
  isActive!: boolean
}
