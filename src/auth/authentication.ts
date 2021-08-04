import * as express from "express";
import * as jwt from "jsonwebtoken";


const accessTokenSecret = 'somerandomaccesstoken';

export function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<any> {
    let token =
        request.body.token ||
        request.query.token ||
        request.query.access_token ||
        request.headers["x-access-token"];

    // console.log(request.body, request.headers, request.query, securityName, scopes, token)

    if (securityName === "api_key") {

        token = request.headers['x-api-key']
        if (token === "abc123456") {
            console.log("OK", token, securityName, scopes)
            return Promise.resolve({
                id: 1,
                name: "Ironman",
                scopes
            });
        }
        console.log("NO OK")
        return Promise.reject({});
    }

    /// if (securityName !== "jwt") {
    ///     return Promise.reject("requeired jwt")
    /// } 


    console.log("Generic JWT")

    if (!token) {
        return Promise.reject({});
    }

    return new Promise((resolve, reject) => {
        if (!token) {
            reject(new Error("No token provided"));
        }

        jwt.verify(token, accessTokenSecret, function (err: any, decoded: any) {
            if (err) {
                reject(err);
            } else if (scopes) {
                for (let scope of scopes) {
                    if (!decoded.scopes.includes(scope)) {
                        reject(new Error("JWT does not contain required scope."));
                    }
                }
            }
            resolve(decoded);
        });
    });
}
