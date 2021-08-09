import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Put,
  Query,
  Route,
  SuccessResponse,
  Security,
  Tags
} from "tsoa"
import { User } from "../../entities/user"
import { CreateUserParams, UpdateUserParams } from "../../dtos/user.dto"
import { Paginate } from "../../dtos/paginate.dto"
import { Equal, getManager, In } from "typeorm"
import { Photo } from "../../entities/photo"
import { Group } from "../../entities/group"

@Route("api/v1/users")
@Tags("Users")
export class UsersController extends Controller {
  @Get("{id}")
  @Security("jwt")
  public async getUser(@Path() id: number): Promise<User | any> {
    return getManager().findOne(User, id, { relations: ["photos", "groups"] })
  }

  @Put("{id}")
  @Security("jwt", ["userAdmin"])
  @Security("jwt", ["users:update"])
  public async updateUser(@Path() id: number, @Body() item: UpdateUserParams): Promise<User> {
    return await getManager().transaction(async (trx) => {
      const user = await trx.findOneOrFail(User, id, { relations: ["groups", "photos"] })

      if (item.fullName) {
        user.fullName = item.fullName
      }
      if (item.email) {
        user.email = item.email
      }
      if (item.password) {
        user.setPassword(item.password)
      }
      if (item.isActive != undefined) {
        user.isActive = item.isActive
      }
      // Overwrite Groups
      if (item.groups) {
        user.groups = await trx.find(Group, {
          where: { name: In(item.groups.filter((r) => r.name)) }
        })
      }
      // Overwrite Photos
      if (item.photos) {
        user.photos = await trx.find(Photo, {
          where: { url: In(item.photos.filter((p) => p.url)) }
        })
      }
      return trx.save<User>(user)
    })
  }

  @Get("")
  @Security("jwt")
  public async listUsers(
    @Query() page = 1,
    @Query() perPage = 10,
    @Query() isActive = true
  ): Promise<Paginate<User>> {
    const skip = perPage * (page - 1)
    const manager = await getManager()

    const rowsAndTotal = await manager.findAndCount(User, {
      take: perPage,
      skip,
      where: { isActive: Equal(isActive) }
    })

    const rows = rowsAndTotal[0]
    const total = rowsAndTotal[1]
    return { rows, page, perPage, total }
  }

  @SuccessResponse("201", "Created")
  @Post()
  @Security("jwt", ["userAdmin"])
  @Security("jwt", ["users:create"])
  public async createUser(@Body() requestBody: CreateUserParams): Promise<User> {
    return await getManager().transaction(async (trx) => {
      const user = trx.create(User, requestBody)
      return trx.save<User>(user)
    })
  }
}
