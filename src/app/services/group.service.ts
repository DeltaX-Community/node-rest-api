import {
  IGroupDetail,
  IGroupList,
  createGroupList,
  createGroupDetail,
  CreateGroupParams,
  UpdateGroupParams
} from "../dtos"
import { Group, prisma } from "../models"
import { NotFoundError } from "../errors/MessageError"

class GroupService {
  async getGroupDetail(id: number): Promise<IGroupDetail> {
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

    return createGroupDetail(group, group.permissions)
  }

  async updateGroup(id: number, item: UpdateGroupParams): Promise<IGroupDetail> {
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

      const prismaToDelete = toDelete.map((pName) =>
        prisma.group.update({
          where: { id },
          data: { permissions: { disconnect: { name: pName } } }
        })
      )

      const prismaToInsert = toInsert.map((pName) =>
        prisma.group.update({
          where: { id },
          data: { permissions: { connect: { name: pName } } }
        })
      )

      await prisma.$transaction([...prismaToDelete, ...prismaToInsert])
    }

    return await this.getGroupDetail(id)
  }

  async getGroupList(page = 1, perPage = 10, isActive = true): Promise<IGroupList> {
    const skip = perPage * (page - 1)

    const groups = await prisma.group.findMany({
      skip: skip,
      take: perPage,
      where: {
        isActive: isActive
      }
    })

    return createGroupList(groups, page, perPage, 0)
  }

  async createGroup(data: CreateGroupParams): Promise<Group> {
    return await prisma.group.create({ data: data })
  }

  async deleteGroup(id: number): Promise<Group> {
    return await prisma.group.delete({ where: { id } })
  }
}

export const groupService = new GroupService()
