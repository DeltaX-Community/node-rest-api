import {
  createPermissionDetail,
  createPermissionList,
  CreatePermissionParams,
  UpdatePermissionParams,
  IPermissionDetail,
  IPermissionList
} from "../dtos"
import { Permission, prisma } from "../models"
import { NotFoundError } from "../errors/MessageError"

class PermissionService {
  async getPermissionDetail(id: number): Promise<IPermissionDetail> {
    const permission = await prisma.permission.findFirst({
      where: {
        id: id
      }
    })

    if (!permission) {
      throw new NotFoundError("Permission not found!")
    }

    return createPermissionDetail(permission)
  }

  async updatePermission(id: number, item: UpdatePermissionParams): Promise<IPermissionDetail> {
    const permission = await prisma.permission.update({
      where: { id: id },
      data: {
        ...item
      }
    })

    return createPermissionDetail(permission)
  }

  async getPermissionList(
    page = 1,
    perPage = 10,
    username: string | null = null,
    isActive = true
  ): Promise<IPermissionList> {
    const skip = perPage * (page - 1)

    const permissions = await prisma.permission.findMany({
      skip: skip,
      take: perPage,
      where: {
        isActive: isActive,
        groups: {
          every: {
            userGroups: {
              every: {
                user: {
                  username: username || undefined
                }
              }
            }
          }
        }
      }
    })

    return createPermissionList(permissions, page, perPage, 0)
  }

  async createPermission(data: CreatePermissionParams): Promise<Permission> {
    return await prisma.permission.create({ data: data })
  }

  async deletePermission(id: number): Promise<Permission> {
    return await prisma.permission.delete({ where: { id } })
  }
}

export const permissionService = new PermissionService()
