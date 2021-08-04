import { Body, Controller, Get, Path, Post, Put, Query, Route, SuccessResponse, Tags } from "tsoa";
import { Profile } from "../entities/profile";
import { Paginate } from "../dtos/paginate.dto";
import { CreateProfileParams } from "../dtos/profile.dto";
import { getManager } from "typeorm"



@Route("user/profile")
@Tags("User")
export class ProfileController extends Controller {

    @Get("{id}")
    public async getItem(
        @Path() id: number
    ): Promise<Profile | any> {
        return getManager().findOne(Profile, id);
    }

    @Put("{id}")
    public async updateItem(
        @Path() id: number,
        @Body() item: CreateProfileParams
    ): Promise<Profile | void> {
        var manager = await getManager()
        const profile = await manager.findOneOrFail(Profile, id)
        if (item.gender) profile.gender = item.gender
        if (item.photo) profile.photo = item.photo
        return manager.save<Profile>(profile)
    }

    @Get("")
    public async getList(
        @Query() page: number = 1,
        @Query() perPage: number = 10
    ): Promise<Paginate<Profile>> {
        const skip = perPage * (page - 1);
        const manager = await getManager()
        const rows = await manager.find(Profile, { take: perPage, skip });
        const total = await manager.count(Profile)
        return { rows, page, perPage, total }
    }

    @SuccessResponse("201", "Created")
    @Post()
    public async createItem(
        @Body() item: CreateProfileParams
    ): Promise<Profile> {
        var manager = await getManager()
        const newItem = manager.create(Profile, item)
        return manager.save<Profile>(newItem)
    }
}