import { Body, Controller, Get, Path, Post, Put, Query, Route, SuccessResponse, } from "tsoa";
import { User } from "../entities/user";
import { UserCreationParams } from "../dtos/user.dto";
import { Paginate } from "../dtos/paginate.dto";
import { getManager } from "typeorm"

@Route("users")
export class UsersController extends Controller {

    @Get("{userId}")
    public async getUser(
        @Path() userId: number
    ): Promise<User | any> {
        return getManager().findOne(User, userId);
    }

    @Put("{userId}")
    public async putUser(
        @Body() user: User
    ): Promise<User | void> {
        var manager = await getManager()
        return manager.save<User>(user)
    }

    @Get("")
    public async getUsers(
        @Query() page: number = 1,
        @Query() perPage: number = 10,
        @Query() beginDate: Date | null = null,
        @Query() endDate: Date | null = null,
    ): Promise<Paginate<User>> {
        const skip = perPage * (page - 1);
        const manager = await getManager()
        const rows = await manager.find(User, { take: perPage, skip });
        const total = await manager.count(User)
        return { rows, page, perPage, total } as Paginate<User>
    }

    @SuccessResponse("201", "Created")
    @Post()
    public async createUser(
        @Body() requestBody: UserCreationParams
    ): Promise<User> {
        var manager = await getManager()
        const user = manager.create(User, requestBody)
        return manager.save<User>(user)
    }
}