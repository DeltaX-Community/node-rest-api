import { Controller, Get, Path, Post, Put, Request } from "tsoa"
import { Body, Query, Route, SuccessResponse, Security, Tags } from "tsoa"
import { Photo } from "../../entities/photo"
import { User } from "../../entities/user"
import { Paginate } from "../../dtos/paginate.dto"
import { getManager, Equal } from "typeorm"
import { CreatePhotoParams, UpdatePhotoParams } from "../../dtos/photo.dto"
import { ForbiddenError } from "../../../app/errors/MessageError"
import { validatePermissions } from "../../../app/auth/authentication"
import { IAuthData } from "src/app/auth/auth.service"

@Route("api/v1/users/photos")
@Tags("Users")
export class PhotoController extends Controller {
  @Get("{id}")
  @Security("jwt")
  public async getItem(@Path() id: number): Promise<Photo> {
    return getManager().findOneOrFail(Photo, id)
  }

  @Put("{id}")
  @Security("jwt")
  public async updateItem(
    @Request() req: { user: IAuthData },
    @Path() id: number,
    @Body() item: UpdatePhotoParams
  ): Promise<Photo | void> {
    const manager = getManager()
    const photo = await manager.findOneOrFail(Photo, id, {
      relations: ["users"]
    })

    if (!validatePermissions(req.user, ["userAdmin"], photo.user.username)) {
      throw new ForbiddenError("User can not edit this photo!")
    }

    photo.url = item.url
    return manager.save<Photo>(photo)
  }

  @Get("")
  @Security("jwt")
  public async getList(
    @Query() page = 1,
    @Query() perPage = 10,
    @Query() username: string | null = null
  ): Promise<Paginate<Photo>> {
    const skip = perPage * (page - 1)
    const manager = getManager()

    let query = manager.createQueryBuilder(Photo, "photo").innerJoin("photo.user", "user")

    if (username) {
      query = query.where("user.username = :username", { username })
    }

    query.offset(skip)
    query.limit(perPage)

    const rows = await query.getMany()
    const total = await query.getCount()
    return { rows, page, perPage, total }
  }

  @SuccessResponse("201", "Created")
  @Post()
  @Security("jwt")
  public async createItem(
    @Request() req: { user: IAuthData },
    @Body() item: CreatePhotoParams
  ): Promise<Photo> {
    if (!validatePermissions(req.user, ["userAdmin"], item.username)) {
      throw new ForbiddenError("Logged user can not create photo for another user!")
    }

    const manager = getManager()
    const newItem = manager.create(Photo, item)
    newItem.user = await manager.findOneOrFail(User, {
      where: { username: Equal(item.username) }
    })
    return manager.save<Photo>(newItem)
  }
}
