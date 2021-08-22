import { Body, Controller, Get, Post, Route, Request, Security, Tags, Query } from "tsoa"
import { Response, SuccessResponse } from "tsoa"
import { Request as ExpReq } from "express"
import { UserDetailDto, UserDto } from "../../dtos"
import { UnauthorizedError } from "../../errors/MessageError"
import { IAuthData, authService, userService } from "../../services"

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
  @Get("me")
  @Security("jwt")
  public async getUser(@Request() req: { user: IAuthData }): Promise<UserDetailDto> {
    return await userService.getUserDetail(req.user.id)
  }

  @Post("login")
  public async login(
    @Body() { username, password }: { username: string; password: string }
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await authService.login(username, password)
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
  ): Promise<UserDto> {
    const userId = req?.user?.id
    return await authService.changePassword(userId, pass.oldpassword, pass.newpassword)
  }

  @Post("refresh_token")
  public async postRefreshToken(
    @Body() token: { refreshToken: string }
  ): Promise<{ accessToken: string }> {
    if (!token?.refreshToken) {
      throw new UnauthorizedError("Token required!")
    }
    return await authService.getAccessToken(token.refreshToken)
  }

  @Get("logout")
  @Security("jwt")
  @SuccessResponse("200")
  @Response("401", "Success Logout and Unauthorized")
  public logout(@Request() req: ExpReq, @Query() refreshToken = "None"): string {
    authService.logout(refreshToken)

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
