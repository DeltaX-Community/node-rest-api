export class MessageError {
  type: "ERROR" | "WARNING" | "FATAL"
  name: string
  message: string
  status: number

  constructor(type: "ERROR" | "WARNING" | "FATAL", name: string, message: string, status: number) {
    this.type = type
    this.name = name
    this.message = message
    this.status = status
  }
}

export class NotFoundError extends MessageError {
  constructor(message: string) {
    super("ERROR", "Not Found", message, 404)
  }
}

export class UnauthorizedError extends MessageError {
  constructor(message: string) {
    super("ERROR", "Unauthorized", message, 401)
  }
}

export class ForbiddenError extends MessageError {
  constructor(message: string) {
    super("ERROR", "Forbidden", message, 403)
  }
}
