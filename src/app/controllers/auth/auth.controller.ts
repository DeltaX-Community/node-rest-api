import { Body, Controller, Get, Post, Route, Request, Security, Tags } from "tsoa"
import { Response, SuccessResponse } from "tsoa"
import { Request as ExpReq } from "express"
import { User } from "../../entities"
import { getManager } from "typeorm"
import * as jwt from "jsonwebtoken"
import { getUser, getUserById } from "../../auth/auth.service"
import { ForbiddenError, UnauthorizedError } from "../../errors/MessageError"
import { config } from "../../../config"
import { IAuthData } from "../../auth/auth.service"

let refreshTokens: string[] = []

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
  @Get("me")
  @Security("jwt")
  public async getUser(@Request() req: { user: IAuthData }): Promise<User> {
    return getManager().findOneOrFail(User, req.user.id, {
      relations: ["photos", "groups"]
    })
  }

  @Post("login")
  public async login(
    @Body() { username, password }: { username: string; password: string }
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await getUser(username, password)

    // generate an access token
    const accessToken = jwt.sign(user, config.accessTokenSecret, {
      expiresIn: "20m"
    })

    const refreshToken = jwt.sign({ id: user.id }, config.refreshTokenSecret)

    refreshTokens.push(refreshToken)

    return {
      accessToken,
      refreshToken
    }
  }

  @Post("change_password")
  @Security("jwt")
  public async changePassword(
    @Request() req: { user: IAuthData },
    @Body()
    pass: {
      oldpassword: string
      newpassword: string
    }
  ): Promise<User> {
    const userId = req?.user?.id

    const manager = getManager()
    const user = await manager.findOneOrFail(User, userId, {
      select: ["id", "passwordHash"]
    })

    if (!user || !user.veryfyPassword(pass.oldpassword)) {
      throw new UnauthorizedError("Old password are invalid!")
    }

    user?.setPassword(pass.newpassword)
    return await manager.save(user)
  }

  @Post("refresh_token")
  public async postRefreshToken(
    @Body() refreshToken: { token: string }
  ): Promise<{ accessToken: string }> {
    console.log(refreshToken?.token)
    if (!refreshToken?.token) {
      throw new UnauthorizedError("Token required!")
    }

    if (!refreshTokens.includes(refreshToken.token)) {
      throw new ForbiddenError("Invalid Token!")
    }

    const decoded = jwt.verify(refreshToken.token, config.refreshTokenSecret, {
      complete: true
    }) as unknown as { payload: IAuthData }
    const userId = decoded.payload?.id

    const user = await getUserById(userId)

    // generate an access token
    const accessToken = jwt.sign(user, config.accessTokenSecret, {
      expiresIn: "20m"
    })

    return { accessToken }
  }

  @Post("logout")
  @Security("jwt")
  @SuccessResponse("200")
  @Response("401", "Success Logout and Unauthorized")
  public logout(@Request() req: ExpReq, @Body() token: { refreshToken: string }): string {
    refreshTokens = refreshTokens.filter((t) => t !== token.refreshToken)

    // Force 401 and www-authenticate logout for clean credential on browser
    const authorization = req.headers["authorization"]
    if (authorization && authorization.startsWith("Basic ")) {
      this.setStatus(401)
      this.setHeader(
        "WWW-Authenticate",
        'Basic realm="Access to the staging site", charset="UTF-8"'
      )
    }
    return "Ok"
  }
}
