import { Body, Controller, Get, Post, Route, Request, Security, Tags } from "tsoa";
import { User } from "../../entities/user";
import { Equal, getManager, In } from "typeorm"
import * as jwt from "jsonwebtoken";
import { getUser, getUserById } from "../../auth/auth.service";
import { ForbiddenError, UnauthorizedError } from "../../errors/MessageError";
import { config } from "../../../config"


let refreshTokens: string[] = []


@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {

    @Get("current_session")
    @Security("jwt")
    public async getUser(
        @Request() { user }: any
    ): Promise<User> {
        console.log(user)
        return getManager().findOneOrFail(User, user.id, { relations: ["photos", "groups"] });
    }

    @Post("login")
    public async login(
        @Body() { username, password }: {
            username: string;
            password: string
        }
    ): Promise<{ accessToken: string, refreshToken: string }> {

        const user = await getUser(username, password);

        // generate an access token
        const accessToken = jwt.sign(user, config.accessTokenSecret, { expiresIn: '20m' });

        const refreshToken = jwt.sign({
            id: user.id
        }, config.refreshTokenSecret);

        refreshTokens.push(refreshToken);

        return {
            accessToken,
            refreshToken
        };
    }

    @Post("change_password")
    @Security("jwt")
    public async changePassword(
        @Request() req: any,
        @Body() pass: {
            oldpassword: string;
            newpassword: string;
        }
    ): Promise<User> {
        const userId = req?.user?.id

        const manager = getManager();
        const user = await manager.findOneOrFail(User, userId, {
            select: ["id", "passwordHash"]
        });

        if (!user || !user.veryfyPassword(pass.oldpassword)) {
            throw new UnauthorizedError("Old password are invalid!");
        }

        user?.setPassword(pass.newpassword);
        return await manager.save(user);
    }

    @Post("refresh_token")
    public async postRefreshToken(
        @Body() refreshToken: { token: string; }
    ): Promise<{ accessToken: string }> {

        console.log(refreshToken?.token)
        if (!refreshToken?.token) {
            throw new UnauthorizedError("Token required!");
        }

        if (!refreshTokens.includes(refreshToken.token)) {
            throw new ForbiddenError("Invalid Token!");
        }

        const decoded = jwt.verify(refreshToken.token, config.refreshTokenSecret, { complete: true }) as { payload: any };
        const userId = decoded.payload.id as number;

        const user = await getUserById(userId);

        // generate an access token
        const accessToken = jwt.sign(user, config.accessTokenSecret, { expiresIn: '20m' });

        return { accessToken };
    }

    @Post("logout")
    @Security("jwt")
    public async logout(
        @Body() refreshToken: { token: string; }
    ): Promise<string> {
        refreshTokens = refreshTokens.filter(t => t !== refreshToken.token);
        return "Ok"
    }
}
