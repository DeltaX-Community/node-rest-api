import {
  GroupDetailDto,
  GroupListDto,
  buildGroupListDto,
  buildGroupDetailDto,
  CreateGroupDto,
  UpdateGroupDto,
  GroupDto
} from "../dtos"
import { prisma } from "../models"
import { NotFoundError } from "../errors/MessageError"

class GroupService {
  async getGroupDetail(id: number): Promise<GroupDetailDto> {
    const group = await prisma.group.findFirst({
      where: {
        id: id
      },
      include: {
        permissions: true
      }
    })

    if (!group) {
      throw new NotFoundError("Group not found!")
    }

    return buildGroupDetailDto(group, group.permissions)
  }

  async updateGroup(id: number, item: UpdateGroupDto): Promise<GroupDetailDto> {
    const group = await prisma.group.update({
      where: { id: id },
      data: {
        description: item.description || undefined,
        isActive: item.isActive || undefined
      },
      include: {
        permissions: true
      }
    })

    if (item.permissions) {
      const permissions = item.permissions.map((p) => p.name)
      const permissionsCurrent = group.permissions.map((p) => p.name)
      const toDelete = permissionsCurrent.filter((p) => !permissions.includes(p))
      const toInsert = permissions.filter((p) => !permissionsCurrent.includes(p))

      console.log("toDelete", toDelete)
      console.log("toInsert", toInsert)

      const prismaToDisconnect = toDelete.map((pName) =>
        prisma.group.update({
          where: { id },
          data: { permissions: { disconnect: { name: pName } } }
        })
      )

      const prismaToConnect = toInsert.map((pName) =>
        prisma.group.update({
          where: { id },
          data: { permissions: { connect: { name: pName } } }
        })
      )

      await prisma.$transaction([...prismaToDisconnect, ...prismaToConnect])
    }

    return await this.getGroupDetail(id)
  }

  async getGroupList(page = 1, perPage = 10, isActive = true): Promise<GroupListDto> {
    const skip = perPage * (page - 1)

    const rowsAndCount = await prisma.$transaction([
      prisma.group.findMany({
        skip: skip,
        take: perPage,
        where: { isActive: isActive }
      }),
      prisma.group.count({ where: { isActive: isActive } })
    ])

    return buildGroupListDto(rowsAndCount[0], page, perPage, rowsAndCount[1])
  }

  async createGroup(data: CreateGroupDto): Promise<GroupDetailDto> {
    const connectPermissions = data.permissions?.map((p) => {
      return { name: p.name }
    })

    const group = await prisma.group.create({
      data: {
        name: data.name,
        description: data.description,
        permissions: {
          connect: connectPermissions
        }
      },
      include: { permissions: true }
    })

    return buildGroupDetailDto(group, group.permissions)
  }

  async deleteGroup(id: number): Promise<GroupDto> {
    return await prisma.group.delete({ where: { id } })
  }
}

export const groupService = new GroupService()
