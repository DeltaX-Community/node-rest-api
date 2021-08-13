import { User, Permission } from "../entities"
import { getManager, Equal } from "typeorm"
import { UnauthorizedError } from "../errors/MessageError"

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

/**
 * Valida permisos de usuario.
 *
 * Se usa scope para validar permisos
 * Rechaza si el scope solicita un permiso no incluido en permissions o en groups
 *
 * si pertenece al grupo admin'
 *
 * Se asume que los nombres cargados en Groups son distintos a Permission.
 *
 * Group:
 *      Administrator
 *      Editor
 *      Viewer
 *      etc.
 *
 * Permission:
 *      user:create
 *      user:edit
 *      user:view
 *      tableXYZ:update
 *      etc
 *
 * @param user
 * @param scopes
 */
export function validatePermissions(
  user: IAuthData,
  scopes?: string[],
  username: string | null = null
): boolean {
  if (user.groups?.includes("admin")) {
    return true
  }
  if (username && user.username == username) {
    return true
  }
  if (scopes) {
    const hasScope = scopes.find((s) => user.permissions?.includes(s) || user.groups?.includes(s))
    return !!hasScope
  }
  return !!user
}
