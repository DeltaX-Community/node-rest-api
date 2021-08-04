import { Body, Controller, Get, Path, Post, Put, Query, Route, SuccessResponse, Tags } from "tsoa";
import { Photo } from "../entities/photo";
import { User } from "../entities/user";
import { Paginate } from "../dtos/paginate.dto";
import { getManager, Equal } from "typeorm"
import { CreatePhotoParams, UpdatePhotoParams } from "../dtos/photo.dto";


@Route("user/photo")
@Tags("User")
export class PhotoController extends Controller {

    @Get("{id}")
    public async getItem(
        @Path() id: number
    ): Promise<Photo | any> {
        return getManager().findOne(Photo, id);
    }

    @Put("{id}")
    public async updateItem(
        @Path() id: number,
        @Body() item: UpdatePhotoParams
    ): Promise<Photo | void> {
        var manager = await getManager()
        const photo = await manager.findOneOrFail(Photo, id)
        photo.url = item.url
        return manager.save<Photo>(photo)
    }

    @Get("")
    public async getList(
        @Query() page: number = 1,
        @Query() perPage: number = 10,
        @Query() userName: string | null = null
    ): Promise<Paginate<Photo>> {
        const skip = perPage * (page - 1);
        const manager = await getManager()

        var query = manager
            .createQueryBuilder(Photo, "photo")
            .innerJoin("photo.user", "user");

        if (userName) {
            query = query.where("user.userName = :userName", { userName });
        }

        query.offset(skip)
        query.limit(perPage)

        const rows = await query.getMany();
        const total = await query.getCount();
        return { rows, page, perPage, total }
    }

    @SuccessResponse("201", "Created")
    @Post()
    public async createItem(
        @Body() item: CreatePhotoParams
    ): Promise<Photo> {
        var manager = await getManager()
        const newItem = manager.create(Photo, item)
        newItem.user = await manager.findOneOrFail(User, { where: { lastName: Equal(item.userName) } })
        return manager.save<Photo>(newItem)
    }
}

