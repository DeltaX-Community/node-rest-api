import {
  buildUserDetailDto,
  UserDetailDto,
  UserListDto,
  UpdateUserDto,
  buildUserListsDto,
  CreateUserDto,
  UserDto
} from "../dtos"
import { prisma, User } from "../models"
import { NotFoundError } from "../errors/MessageError"

class UserService {
  async getUserDetail(id: number): Promise<UserDetailDto> {
    const user = await prisma.user.findFirst({
      where: {
        id: id
      },
      include: {
        photos: true,
        groups: {
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
    const groups = user.groups.map((ug) => ug.group)
    const permissions = groups.flatMap((g) => g.permissions)
    return buildUserDetailDto(user, photos, groups, permissions)
  }

  async updateUser(id: number, item: UpdateUserDto): Promise<UserDetailDto> {
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
              groups: {
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
        groups: {
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
    const groups = user.groups.map((ug) => ug.group)
    const permissions = groups.flatMap((g) => g.permissions)
    return buildUserDetailDto(user, photos, groups, permissions)
  }

  async getUserList(page = 1, perPage = 10, isActive = true): Promise<UserListDto> {
    const skip = perPage * (page - 1)

    const rowsAndCount = await prisma.$transaction([
      prisma.user.findMany({
        skip: skip,
        take: perPage,
        where: { isActive: isActive }
      }),
      prisma.user.count({ where: { isActive: isActive } })
    ])

    return buildUserListsDto(rowsAndCount[0], page, perPage, rowsAndCount[1])
  }

  async createUser(data: CreateUserDto): Promise<UserDto> {
    return await prisma.user.create({ data })
  }

  async deleteUser(id: number): Promise<UserDto> {
    return await prisma.user.delete({ where: { id } })
  }
}

export const userService = new UserService()
