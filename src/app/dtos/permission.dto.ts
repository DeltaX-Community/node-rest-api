import { Permission } from "../models"
import { Paginate } from "./paginate.dto"

export type CreatePermissionDto = {
  name: string
  description?: string
}

export type UpdatePermissionDto = {
  description?: string
  isActive?: boolean
}

export type PermissionListDto = Paginate<Permission>

export type PermissionDetailDto = Permission

export type PermissionDto = Permission

export function buildPermissionListDto(
  permissions: Permission[],
  page: number,
  perPage: number,
  total: number
): PermissionListDto {
  const rows = permissions.map((p) => {
    return { ...p } as unknown as Permission
  })

  return { rows, page, perPage, total }
}

export function buildPermissionDetailDto(permission: Permission): PermissionDetailDto {
  return {
    ...permission
  } as PermissionDetailDto
}
