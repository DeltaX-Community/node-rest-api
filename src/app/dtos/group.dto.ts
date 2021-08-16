import { Group, Permission } from "../models"
import { Paginate } from "./paginate.dto"

export interface CreateGroupParams {
  name: string
  description: string
  permissions?: { name: string }[]
}

export interface UpdateGroupParams {
  description?: string
  isActive?: boolean
  permissions?: { name: string }[]
}

export type IGroupList = Paginate<Group>

export type IGroupDetail = Group & {
  permissions: Permission[]
}

export function createGroupList(
  groups: Group[],
  page: number,
  perPage: number,
  total: number
): IGroupList {
  const rows = groups.map((p) => {
    return { ...p, passwordHash: undefined } as unknown as Group
  })

  return { rows, page, perPage, total }
}

export function createGroupDetail(group: Group, permissions: Permission[]): IGroupDetail {
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    updatedAt: group.updatedAt,
    createAt: group.createAt,
    isActive: group.isActive,
    permissions: permissions
  } as IGroupDetail
}
