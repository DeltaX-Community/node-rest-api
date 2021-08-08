export class MessageError {
    type: 'ERROR' | 'WARNING' | "FATAL";
    name: string;
    message: string;
    status: number;

    constructor(type: 'ERROR' | 'WARNING' | "FATAL", name: string, message: string, status: number) {
        this.type = type;
        this.name = name;
        this.message = message;
        this.status = status;
    }
}

export class UnauthorizedError extends MessageError {
    constructor(message: string, name: string = "") {
        super("ERROR", name || "Unauthorized", message, 401)
    }
}

export class ForbiddenError extends MessageError {
    constructor(message: string, name: string = "") {
        super("ERROR", name || "Forbidden", message, 403)
    }
}