import { Body, Controller, Get, Path, Post, Put, Query, Route, SuccessResponse, } from "tsoa";
import { User } from "../entities/user";
import { Profile } from "../entities/profile";
import { CreateUserParams, UpdateUserParams } from "../dtos/user.dto";
import { Paginate } from "../dtos/paginate.dto";
import { getManager } from "typeorm"
import { Photo } from "../entities/photo";

@Route("users")
export class UsersController extends Controller {

    @Get("{id}")
    public async getUser(
        @Path() id: number
    ): Promise<User | any> {
        return getManager().findOne(User, id, { relations: ["profile", "photos"] });
    }

    @Put("{id}")
    public async putUser(
        @Path() id: number,
        @Body() item: UpdateUserParams
    ): Promise<User> {
        return await getManager().transaction(async (trx) => {
            const user = await trx.findOneOrFail(User, id, { relations: ["profile", "photos"] })
            if (item.profile) {
                const profile = trx.create(Profile, item.profile)
                user.profile = await trx.save(profile)
            }
            if (item.addPhotos) {
                const photos = trx.create(Photo, item.addPhotos)
                user.photos = [...await trx.save(photos), ...user.photos]
            }
            if (item.lastName) user.lastName = item.lastName
            if (item.firstName) user.firstName = item.firstName
            return trx.save<User>(user)
        })
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
        @Body() requestBody: CreateUserParams
    ): Promise<User> {
        return await getManager().transaction(async (trx) => {
            const user = trx.create(User, requestBody)
            if (requestBody.profile) {
                const profile = trx.create(Profile, requestBody.profile)
                user.profile = await trx.save(profile)
            }
            return trx.save<User>(user)
        })
    }
}