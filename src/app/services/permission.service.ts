import {
  buildPermissionDetailDto,
  buildPermissionListDto,
  CreatePermissionDto,
  UpdatePermissionDto,
  PermissionDetailDto,
  PermissionListDto,
  PermissionDto
} from "../dtos"
import { prisma } from "../models"
import { NotFoundError } from "../errors/MessageError"

class PermissionService {
  async getPermissionDetail(id: number): Promise<PermissionDetailDto> {
    const permission = await prisma.permission.findFirst({
      where: {
        id: id
      }
    })

    if (!permission) {
      throw new NotFoundError("Permission not found!")
    }

    return buildPermissionDetailDto(permission)
  }

  async updatePermission(id: number, item: UpdatePermissionDto): Promise<PermissionDetailDto> {
    const permission = await prisma.permission.update({
      where: { id: id },
      data: {
        ...item
      }
    })

    return buildPermissionDetailDto(permission)
  }

  async getPermissionList(
    page = 1,
    perPage = 10,
    username: string | null = null,
    isActive = true
  ): Promise<PermissionListDto> {
    const skip = perPage * (page - 1)

    const where = {
      isActive: isActive,
      groups: {
        some: {
          users: {
            some: {
              user: {
                username: username || undefined
              }
            }
          }
        }
      }
    }

    const rowsAndCount = await prisma.$transaction([
      prisma.permission.findMany({ skip: skip, take: perPage, where }),
      prisma.permission.count({ where })
    ])

    return buildPermissionListDto(rowsAndCount[0], page, perPage, rowsAndCount[1])
  }

  async createPermission(data: CreatePermissionDto): Promise<PermissionDto> {
    return await prisma.permission.create({ data: data })
  }

  async deletePermission(id: number): Promise<PermissionDto> {
    return await prisma.permission.delete({ where: { id } })
  }
}

export const permissionService = new PermissionService()
