import { Group, Permission } from "../models"
import { Paginate } from "./paginate.dto"

export type CreateGroupDto = {
  name: string
  description: string
  permissions?: { name: string }[]
}

export type UpdateGroupDto = {
  description?: string
  isActive?: boolean
  permissions?: { name: string }[]
}

export type GroupListDto = Paginate<Group>

export type GroupDto = Group

export type GroupDetailDto = Group & {
  permissions: Permission[]
}

export function buildGroupListDto(
  groups: Group[],
  page: number,
  perPage: number,
  total: number
): GroupListDto {
  const rows = groups.map((p) => {
    return { ...p, passwordHash: undefined } as unknown as Group
  })

  return { rows, page, perPage, total }
}

export function buildGroupDetailDto(group: Group, permissions: Permission[]): GroupDetailDto {
  return {
    ...group,
    permissions: permissions
  } as GroupDetailDto
}
