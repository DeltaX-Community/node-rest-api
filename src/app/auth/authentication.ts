import * as express from "express"
import * as jwt from "jsonwebtoken"
import { IAuthData, authService } from "../services/auth.service"
import { ForbiddenError, UnauthorizedError } from "../errors/MessageError"
import { ACCESS_TOKEN_SECRET } from "../../config"

export async function expressAuthentication(
  request: express.Request,
  _securityName: string,
  scopes?: string[]
): Promise<unknown> {
  let token: string
  const authorization = request.headers["authorization"]

  if (authorization && authorization.startsWith("Basic")) {
    const userPassStr = Buffer.from(authorization.split(" ")[1], "base64").toString()
    const userPass = userPassStr.split(":")
    const username = userPass[0]
    const password = userPass[1]

    const user = await authService.getUser(username, password)

    if (!authService.validatePermissions(user, scopes)) {
      throw new ForbiddenError("JWT does not contain required permission.")
    }
    return user
  }

  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1]
  } else {
    token =
      (request.body as { token: string }).token || (request.headers["x-access-token"] as string)
  }

  if (token) {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET, {
      complete: true
    }) as { payload: unknown }

    const user = decoded.payload as IAuthData
    if (!authService.validatePermissions(user, scopes)) {
      throw new ForbiddenError("JWT does not contain required permission.")
    }
    return user
  }

  throw new UnauthorizedError("Not token provided!")
}
