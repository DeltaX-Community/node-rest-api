import { Body, Controller, Get, Post, Route, Request, Security, Tags, Query } from "tsoa"
import { Response, SuccessResponse } from "tsoa"
import { Request as ExpReq } from "express"
import { User, prisma } from "../../models"
import { IUserDetail } from "../../dtos"
import * as jwt from "jsonwebtoken"
import { ForbiddenError, UnauthorizedError } from "../../errors/MessageError"
import { config } from "../../../config"
import { IAuthData, authService, userService } from "../../services"

let refreshTokens: string[] = []

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
  @Get("me")
  @Security("jwt")
  public async getUser(@Request() req: { user: IAuthData }): Promise<IUserDetail> {
    return await userService.getUserDetail(req.user.id)
  }

  @Post("login")
  public async login(
    @Body() { username, password }: { username: string; password: string }
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await authService.getUser(username, password)

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
    const user = await prisma.user.findFirst({ where: { id: userId } })

    if (!user || !authService.veryfyPassword(user.passwordHash, pass.oldpassword)) {
      throw new UnauthorizedError("Old password are invalid!")
    }

    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash: authService.getPasswordHash(pass.newpassword) }
    })
  }

  @Post("refresh_token")
  public async postRefreshToken(
    @Body() token: { refreshToken: string }
  ): Promise<{ accessToken: string }> {
    console.log(token?.refreshToken)
    if (!token?.refreshToken) {
      throw new UnauthorizedError("Token required!")
    }

    if (!refreshTokens.includes(token.refreshToken)) {
      throw new ForbiddenError("Invalid Token!")
    }

    const decoded = jwt.verify(token.refreshToken, config.refreshTokenSecret, {
      complete: true
    }) as unknown as { payload: IAuthData }
    const userId = decoded.payload?.id

    const user = await authService.getUserById(userId)

    // generate an access token
    const accessToken = jwt.sign(user, config.accessTokenSecret, {
      expiresIn: "20m"
    })

    return { accessToken }
  }

  @Get("logout")
  @Security("jwt")
  @SuccessResponse("200")
  @Response("401", "Success Logout and Unauthorized")
  public logout(@Request() req: ExpReq, @Query() refreshToken = "None"): string {
    refreshTokens = refreshTokens.filter((t) => t !== refreshToken)

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
