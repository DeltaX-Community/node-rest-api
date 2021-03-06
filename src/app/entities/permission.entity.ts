import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { CreateDateColumn, UpdateDateColumn, Index, ManyToMany } from "typeorm"
import { Group } from "./group.entity"

@Entity({ name: "permissions" })
export class Permission {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  @Index({ unique: true })
  name!: string

  @Column({ nullable: true })
  description!: string

  @ManyToMany(() => Group, (group) => group.permissions, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  })
  groups!: Group[]

  @UpdateDateColumn()
  updatedAt!: Date

  @CreateDateColumn()
  createAt!: Date

  @Column({ default: true })
  isActive!: boolean
}
