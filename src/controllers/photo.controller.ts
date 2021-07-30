import { Body, Controller, Get, Path, Post, Put, Query, Route, SuccessResponse, } from "tsoa";
import { Photo } from "../entities/photo";
import { User } from "../entities/user";
import { Paginate } from "../dtos/paginate.dto";
import { getManager, Equal } from "typeorm"
import { CreatePhotoParams } from "../dtos/photo.dto";


@Route("photo")
export class PhotoController extends Controller {

    @Get("{id}")
    public async getItem(
        @Path() id: number
    ): Promise<Photo | any> {
        return getManager().findOne(Photo, id);
    }

    @Put("{userId}")
    public async updateItem(
        @Body() item: Photo
    ): Promise<Photo | void> {
        var manager = await getManager()
        return manager.save<Photo>(item)
    }

    @Get("")
    public async getList(
        @Query() page: number = 1,
        @Query() perPage: number = 10,
        @Query() beginDate: Date | null = null,
        @Query() endDate: Date | null = null,
    ): Promise<Paginate<Photo>> {
        const skip = perPage * (page - 1);
        const manager = await getManager()
        const rows = await manager.find(Photo, { take: perPage, skip });
        const total = await manager.count(Photo)
        return { rows, page, perPage, total } as Paginate<Photo>
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

