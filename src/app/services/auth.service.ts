import { prisma } from "../models"
import { NotFoundError, UnauthorizedError } from "../errors/MessageError"
import * as bcrypt from "bcrypt"

export interface IAuthData {
  id: number
  username: string
  fullName: string
  permissions: string[]
  groups: string[]
}

class AuthService {
  getPasswordHash(pass: string) {
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(pass, salt)
  }

  veryfyPassword(passwordHash: string | null, password: string) {
    return !passwordHash || passwordHash == "" || bcrypt.compareSync(password, passwordHash)
  }

  async getUser(username: string, password: string): Promise<IAuthData> {
    const user = await prisma.user.findFirst({
      where: { username: username },
      include: {
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

    if (!user || !this.veryfyPassword(user.passwordHash, password)) {
      throw new UnauthorizedError("Username or password are Invalid!")
    }

    const groups = user.userGroups.map((ug) => ug.group)
    const permissions = groups.flatMap((g) => g.permissions).filter((p) => !!p)

    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      permissions: permissions?.map((p) => p.name),
      groups: groups?.map((g) => g.name)
    }
  }

  async getUserById(id: number): Promise<IAuthData> {
    const user = await prisma.user.findUnique({
      where: { id: id },
      include: {
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

    const groups = user.userGroups.map((ug) => ug.group)
    const permissions = groups.flatMap((g) => g.permissions).filter((p) => !!p)

    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      permissions: permissions?.map((p) => p.name),
      groups: groups?.map((g) => g.name)
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
  validatePermissions(user: IAuthData, scopes?: string[], username: string | null = null): boolean {
    if (user.groups?.includes("admin")) {
      return true
    }
    if (username && user.username == username) {
      return true
    }
    if (scopes && scopes.length > 0) {
      const hasScope = scopes.find((s) => user.permissions?.includes(s) || user.groups?.includes(s))
      return !!hasScope
    }
    return !!user
  }
}

export const authService = new AuthService()
