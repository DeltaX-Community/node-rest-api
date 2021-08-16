import { User, Photo, Group, Permission } from "../models"
import { Paginate } from "./paginate.dto"

export interface CreateUserParams {
  username: string
  fullName: string
  email?: string
}

export interface UpdateUserParams {
  fullName?: string
  email?: string
  password?: string
  isActive?: boolean
  groups?: { name: string }[]
  photos?: { url: string }[]
}

// export type IUserList = Paginate<Omit<User, "passwordHash">>
export type IUserList = Paginate<User>

export type IUserDetail = User & {
  photos: Photo[]
  groups: Group[]
  permissions: string[]
}

export function createUserLists(
  users: User[],
  page: number,
  perPage: number,
  total: number
): IUserList {
  const rows = users.map((u) => {
    return { ...u, passwordHash: undefined } as unknown as User
  })
  return { rows, page, perPage, total }
}

export function createUserDetail(
  user: User,
  photos: Photo[] | null,
  groups: Group[] | null,
  permissions: Permission[] | null
): IUserDetail {
  const groupsOnly = groups?.map((g) => {
    return { ...g, permissions: undefined } as Group
  })

  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    photos: photos,
    groups: groupsOnly,
    permissions: permissions?.map((p) => p.name),
    updatedAt: user.updatedAt,
    createAt: user.createAt,
    isActive: user.isActive
  } as IUserDetail
}
