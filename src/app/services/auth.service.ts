import { prisma } from "../models"
import { ForbiddenError, NotFoundError, UnauthorizedError } from "../errors/MessageError"
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../../config"
import { UserDto } from "../dtos"

export interface IAuthData {
  id: number
  username: string
  fullName: string
  permissions: string[]
  groups: string[]
}

class AuthService {
  private _refreshTokens: string[] = []

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

    if (!user || !this.veryfyPassword(user.passwordHash, password)) {
      throw new UnauthorizedError("Username or password are Invalid!")
    }

    const groups = user.groups.map((ug) => ug.group)
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

    const groups = user.groups.map((ug) => ug.group)
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

  public async login(
    username: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.getUser(username, password)

    // generate an access token
    const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, {
      expiresIn: "20m"
    })

    const refreshToken = jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET)

    this._refreshTokens.push(refreshToken)

    return {
      accessToken,
      refreshToken
    }
  }

  public async changePassword(
    userId: number,
    oldpassword: string,
    newpassword: string
  ): Promise<UserDto> {
    const user = await prisma.user.findFirst({ where: { id: userId } })

    if (!user || !this.veryfyPassword(user.passwordHash, oldpassword)) {
      throw new UnauthorizedError("Old password are invalid!")
    }

    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash: this.getPasswordHash(newpassword) }
    })
  }

  public async getAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    if (!this._refreshTokens.includes(refreshToken)) {
      throw new ForbiddenError("Invalid Token!")
    }

    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, {
      complete: true
    }) as unknown as { payload: IAuthData }
    const userId = decoded.payload?.id

    const user = await this.getUserById(userId)

    // generate an access token
    const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, {
      expiresIn: "20m"
    })

    return { accessToken }
  }

  public logout(refreshToken): void {
    this._refreshTokens = this._refreshTokens.filter((t) => t !== refreshToken)
  }
}

export const authService = new AuthService()
