import * as express from "express";
import * as jwt from "jsonwebtoken";
import { getUser, IAuthData } from "./auth.service";
import { ForbiddenError, UnauthorizedError } from "../errors/MessageError";
import config from "../config/config.json"


/**
 * Valida permisos de usuario.
 * 
 * Se usa scope para validar permisos
 * Rechaza si el scope solicita un permiso no incluido 
 * en Permission o en Group
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
export function validatePermissions(user: IAuthData, scopes?: string[]) {
    if (user?.groups?.includes("admin")) {
        return;
    }
    if (scopes) {
        for (let scope of scopes) {
            if (!user.permissions?.includes(scope) && !user.groups?.includes(scope)) {
                throw new ForbiddenError("JWT does not contain required permission.")
            }
        }
    }
}


export async function expressAuthentication(
    request: express.Request,
    _securityName: string,
    scopes?: string[]
): Promise<any> {
    let token: string;
    const authorization = request.headers['authorization']

    console.log(request.headers)

    if (authorization && authorization.startsWith("Basic")) {
        console.log("Check Basic authorization")
        const userPassStr = Buffer.from(authorization.split(" ")[1], 'base64').toString();
        const userPass = userPassStr.split(":");
        const username = userPass[0]
        const password = userPass[1]

        const user = await getUser(username, password);
        validatePermissions(user, scopes)
        return user;
    }

    if (authorization && authorization.startsWith("Bearer")) {
        console.log("Check Bearer authorization")
        token = authorization.split(" ")[1];
    }
    else {
        console.log("Check x-access-token authorization")
        token = request.body.token || request.headers["x-access-token"];
    }

    if (token) {
        const decoded = jwt.verify(token, config.accessTokenSecret, { complete: true }) as { payload: any };
        const user = decoded.payload as IAuthData;
        validatePermissions(user, scopes)
        return user;
    }

    throw new UnauthorizedError("Not token provided!");
}
