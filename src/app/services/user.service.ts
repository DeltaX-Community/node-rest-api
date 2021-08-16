import {
  createUserDetail,
  IUserDetail,
  IUserList,
  UpdateUserParams,
  createUserLists,
  CreateUserParams
} from "../dtos"
import { prisma, User } from "../models"
import { NotFoundError } from "../errors/MessageError"

class UserService {
  async getUserDetail(id: number): Promise<IUserDetail> {
    const user = await prisma.user.findFirst({
      where: {
        id: id
      },
      include: {
        photos: true,
        userGroups: {
          include: {
            group: {
              include: {
                permissions: true
              }
            }
          }
        }
      }
    })

    if (!user) {
      throw new NotFoundError("User not found!")
    }

    const photos = user.photos
    const groups = user.userGroups.map((ug) => ug.group)
    const permissions = groups.flatMap((g) => g.permissions)
    return createUserDetail(user, photos, groups, permissions)
  }

  async updateUser(id: number, item: UpdateUserParams): Promise<IUserDetail> {
    const data = { ...item, groups: undefined, photos: undefined }

    const existUser = await this.getUserDetail(id)

    if (!existUser) {
      throw new NotFoundError("User not found!")
    }

    if (item.groups) {
      const gNames = item.groups.map((g) => g.name)
      const toDelete = existUser.groups.filter((g) => !gNames.includes(g.name)).map((g) => g.id)
      const toInsert = gNames.filter((gn) => !existUser.groups.map((g) => g.name)?.includes(gn))

      await prisma.$transaction([
        prisma.userGroups.deleteMany({ where: { groupId: { in: toDelete } } }),
        ...toInsert.map((g) =>
          prisma.user.update({
            where: { id: id },
            data: {
              userGroups: {
                create: {
                  group: { connect: { name: g } }
                }
              }
            }
          })
        )
      ])
    }

    const user = await prisma.user.update({
      where: { id: id },
      data: { ...data },
      include: {
        photos: true,
        userGroups: {
          include: {
            group: {
              include: {
                permissions: true
              }
            }
          }
        }
      }
    })

    const photos = user.photos
    const groups = user.userGroups.map((ug) => ug.group)
    const permissions = groups.flatMap((g) => g.permissions)
    return createUserDetail(user, photos, groups, permissions)
  }

  async listUsers(page = 1, perPage = 10, isActive = true): Promise<IUserList> {
    const skip = perPage * (page - 1)

    const users = await prisma.user.findMany({
      skip: skip,
      take: perPage,
      where: {
        isActive: isActive
      }
    })

    return createUserLists(users, page, perPage, 0)
  }

  async createUser(data: CreateUserParams): Promise<User> {
    return await prisma.user.create({ data })
  }

  async deleteUser(id: number): Promise<User> {
    return await prisma.user.delete({ where: { id } })
  }
}

export const userService = new UserService()
