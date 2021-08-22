import { Controller, Get, Path, Post, Put, Request } from "tsoa"
import { Body, Query, Route, SuccessResponse, Security, Tags } from "tsoa"
import { CreatePhotoDto, UpdatePhotoDto, PhotoDetailDto, PhotoListDto, PhotoDto } from "../../dtos"
import { ForbiddenError } from "../../../app/errors/MessageError"
import { IAuthData, photoService, authService } from "../../services"

@Route("api/v1/users/photos")
@Tags("Users")
export class PhotoController extends Controller {
  @Get("{id}")
  @Security("jwt")
  public async getPhotoDetail(@Path() id: number): Promise<PhotoDetailDto> {
    return await photoService.getPhotoDetail(id)
  }

  @Put("{id}")
  @Security("jwt")
  public async updatePhoto(
    @Request() req: { user: IAuthData },
    @Path() id: number,
    @Body() item: UpdatePhotoDto
  ): Promise<PhotoDetailDto> {
    const photo = await photoService.getPhotoDetail(id)

    if (!authService.validatePermissions(req.user, ["userAdmin"], photo.user.username)) {
      throw new ForbiddenError("User can not edit this photo!")
    }

    return await photoService.updatePhoto(id, item)
  }

  @Get("")
  @Security("jwt")
  public async getPhotoList(
    @Query() page = 1,
    @Query() perPage = 10,
    @Query() username: string | null = null
  ): Promise<PhotoListDto> {
    return await photoService.getPhotoList(page, perPage, username)
  }

  @SuccessResponse("201", "Created")
  @Post()
  @Security("jwt")
  public async createPhoto(
    @Request() req: { user: IAuthData },
    @Body() item: CreatePhotoDto
  ): Promise<PhotoDto> {
    if (!authService.validatePermissions(req.user, ["userAdmin"], item.username)) {
      throw new ForbiddenError("Logged user can not create photo for another user!")
    }

    this.setStatus(201)
    return await photoService.createPhoto(item)
  }
}
