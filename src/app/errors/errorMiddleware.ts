import { Router, Request, Response, NextFunction } from "express"
import { ValidateError } from "@tsoa/runtime"
import { MessageError } from "./MessageError"
import { JsonWebTokenError } from "jsonwebtoken"

export function RegisterErrorMiddleware(app: Router) {
  app.use(function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void {
    if (err instanceof ValidateError) {
      console.warn(`Caught Validation Error for ${req.path}:`, err.fields)
      return res.status(422).json({
        message: "Validation Failed",
        details: err?.fields
      })
    }
    if (err instanceof MessageError) {
      return res.status(err.status || 500).json(err)
    }
    if (err instanceof JsonWebTokenError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const st = (err as any)?.status
      return res.status(st || 500).json(err)
    }
    if (err instanceof Error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const st = (err as any)?.status
      return res.status(st >= 400 ? st : 500).json({
        message: "Internal Server Error",
        error: `${err}`
      })
    }
    next()
  })
}
