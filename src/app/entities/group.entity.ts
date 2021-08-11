import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm"
import { CreateDateColumn, UpdateDateColumn, Index, JoinTable } from "typeorm"
import { User } from "./user.entity"
import { Permission } from "./permission.entity"

@Entity({ name: "groups" })
export class Group {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  @Index({ unique: true })
  name!: string

  @Column({ nullable: false })
  description!: string

  @ManyToMany(() => User, (user) => user.groups, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  })
  users!: User[]

  @ManyToMany(() => Permission, (permission) => permission.groups, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  })
  @JoinTable({
    name: "groupPermission",
    joinColumn: { name: "groupId" },
    inverseJoinColumn: { name: "permissionId" }
  })
  permissions!: Permission[]

  @UpdateDateColumn()
  updatedAt!: Date

  @CreateDateColumn()
  createAt!: Date

  @Column({ default: true })
  isActive!: boolean
}
