import { Permission } from "../models"
import { Paginate } from "./paginate.dto"

export interface CreatePermissionParams {
  name: string
  description?: string
}

export interface UpdatePermissionParams {
  description?: string
  isActive?: boolean
}

export type IPermissionList = Paginate<Permission>

export type IPermissionDetail = Permission

export function createPermissionList(
  permissions: Permission[],
  page: number,
  perPage: number,
  total: number
): IPermissionList {
  const rows = permissions.map((p) => {
    return { ...p } as unknown as Permission
  })

  return { rows, page, perPage, total }
}

export function createPermissionDetail(permission: Permission): IPermissionDetail {
  return {
    id: permission.id,
    name: permission.name,
    description: permission.description,
    updatedAt: permission.updatedAt,
    createAt: permission.createAt,
    isActive: permission.isActive
  } as IPermissionDetail
}
