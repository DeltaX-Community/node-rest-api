import { Router, Request, Response, NextFunction } from "express"
import { ValidateError } from "@tsoa/runtime"
import { MessageError, UnauthorizedError } from "./MessageError"
import { JsonWebTokenError } from "jsonwebtoken"

export function registerErrorMiddleware(app: Router) {
  app.use(function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void {
    if (err instanceof ValidateError) {
      return res.status(422).json({
        message: "Validation Failed",
        details: err?.fields
      })
    }
    if (err instanceof UnauthorizedError) {
      return res
        .status(err.status)
        .setHeader("WWW-Authenticate", 'Basic realm="Access to the staging site", charset="UTF-8"')
        .json(err)
    }
    if (err instanceof MessageError) {
      return res.status(err.status || 500).json(err)
    }
    if (err instanceof JsonWebTokenError) {
      const st = (err as unknown as { status: number })?.status
      return res.status(st || 500).json(err)
    }
    if (err instanceof Error) {
      const st = (err as unknown as { status: number })?.status
      return res.status(st >= 400 ? st : 500).json({
        message: "Internal Server Error",
        error: `${err}`
      })
    }
    next()
  })
}
