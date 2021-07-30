import { Body, Controller, Get, Path, Post, Put, Query, Route, SuccessResponse, } from "tsoa";
import { Profile } from "../entities/profile";
import { Paginate } from "../dtos/paginate.dto";
import { getManager } from "typeorm"



@Route("profile")
export class ProfileController extends Controller {

    @Get("{id}")
    public async getItem(
        @Path() id: number
    ): Promise<Profile | any> {
        return getManager().findOne(Profile, id);
    }

    @Put("{userId}")
    public async updateItem(
        @Body() item: Profile
    ): Promise<Profile | void> {
        var manager = await getManager()
        return manager.save<Profile>(item)
    }

    @Get("")
    public async getList(
        @Query() page: number = 1,
        @Query() perPage: number = 10,
        @Query() beginDate: Date | null = null,
        @Query() endDate: Date | null = null,
    ): Promise<Paginate<Profile>> {
        const skip = perPage * (page - 1);
        const manager = await getManager()
        const rows = await manager.find(Profile, { take: perPage, skip });
        const total = await manager.count(Profile)
        return { rows, page, perPage, total } as Paginate<Profile>
    }

    @SuccessResponse("201", "Created")
    @Post()
    public async createItem(
        @Body() item: Profile
    ): Promise<Profile> {
        var manager = await getManager()
        const newItem = manager.create(Profile, item)
        return manager.save<Profile>(newItem)
    }
}