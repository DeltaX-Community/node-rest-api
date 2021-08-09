import { User } from "../entities/user"
import { getManager, Equal } from "typeorm"
import { UnauthorizedError } from "../errors/MessageError"
import { Permission } from "../entities/permission"

export interface IAuthData {
  id: number
  username: string
  fullName: string
  permissions: string[]
  groups: string[]
}

export function getPermissions(userId: number) {
  return getManager()
    .createQueryBuilder(Permission, "permissions")
    .innerJoin("permissions.groups", "groups")
    .innerJoin("groups.users", "users")
    .where("users.id = :id", { id: userId })
    .getMany()
}

export async function getUser(username: string, password: string): Promise<IAuthData> {
  const user = await getManager().findOne(User, {
    select: ["username", "id", "passwordHash", "fullName"],
    where: { username: Equal(username) },
    relations: ["groups"]
  })

  if (!user || !user.veryfyPassword(password)) {
    throw new UnauthorizedError("Username or password are Invalid!")
  }

  const permissions = await getPermissions(user.id)

  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    permissions: permissions?.map((p) => p.name),
    groups: user.groups?.map((g) => g.name)
  }
}

export async function getUserById(id: number): Promise<IAuthData> {
  const user = await getManager().findOneOrFail(User, id, {
    select: ["username", "id", "passwordHash", "fullName"],
    relations: ["groups"]
  })

  const permissions = await getPermissions(user.id)

  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    permissions: permissions?.map((p) => p.name),
    groups: user.groups?.map((g) => g.name)
  }
}
