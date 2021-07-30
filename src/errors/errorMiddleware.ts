import { Router, Request, Response, NextFunction } from 'express';
import { ValidateError } from '@tsoa/runtime';

export function RegisterErrorMiddleware(app: Router) {

    app.use(function errorHandler(
        err: unknown,
        req: Request,
        res: Response,
        next: NextFunction
    ): Response | void {
        if (err instanceof ValidateError) {
            console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
            return res.status(422).json({
                message: "Validation Failed",
                details: err?.fields,
            });
        }
        if (err instanceof Error) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: err
            });
        }
        next();
    });
}