import { User, Photo, Group, Permission } from "../models"
import { Paginate } from "./paginate.dto"

export type CreateUserDto = {
  /**
   * @minLength 1 array must not be empty
   */
  username: string
  fullName: string
  email?: string
}

export type UpdateUserDto = {
  fullName?: string
  email?: string
  password?: string
  isActive?: boolean
  groups?: { name: string }[]
  photos?: { url: string }[]
}

export type UserListDto = Paginate<User>

export type UserDto = User

export type UserDetailDto = User & {
  photos: Photo[]
  groups: Group[]
  permissions: string[]
}

export function buildUserListsDto(
  users: User[],
  page: number,
  perPage: number,
  total: number
): UserListDto {
  const rows = users.map((u) => {
    return { ...u, passwordHash: undefined } as unknown as User
  })
  return { rows, page, perPage, total }
}

export function buildUserDetailDto(
  user: User,
  photos: Photo[] | null,
  groups: Group[] | null,
  permissions: Permission[] | null
): UserDetailDto {
  const groupsOnly = groups?.map((g) => {
    return { ...g, permissions: undefined } as Group
  })

  return {
    ...user,
    photos: photos,
    groups: groupsOnly,
    permissions: permissions?.map((p) => p.name)
  } as UserDetailDto
}
