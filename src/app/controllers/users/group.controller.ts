import {
  Body,
  Controller,
  Get,
  Path,
  Delete,
  Post,
  Put,
  Query,
  Route,
  SuccessResponse,
  Security,
  Tags
} from "tsoa"
import { CreateGroupParams, UpdateGroupParams } from "../../dtos/group.dto"
import { Paginate } from "../../dtos/paginate.dto"
import { Equal, getManager, In } from "typeorm"
import { Group } from "../../entities/group"
import { Permission } from "../../entities/permission"
import { User } from "../../entities/user"

@Route("api/v1/users/groups")
@Tags("Users")
export class RoleController extends Controller {
  @Get("{id}")
  @Security("jwt", ["groups:read"])
  public async getGroup(@Path() id: number): Promise<Group> {
    return getManager().findOneOrFail(Group, id, {
      relations: ["users", "permissions"]
    })
  }

  @Put("{id}")
  @Security("jwt", ["groups:update"])
  public async updateGroup(@Path() id: number, @Body() item: UpdateGroupParams): Promise<Group> {
    return await getManager().transaction(async (trx) => {
      const group = await trx.findOneOrFail(Group, id, {
        relations: ["users", "permissions"]
      })

      if (item.isActive != undefined) {
        group.isActive = item.isActive
      }

      if (item.permissions) {
        group.permissions = await trx.find(Permission, {
          where: { name: In(item.permissions.map((p) => p.name)) }
        })
      }

      if (item.users) {
        group.users = await trx.find(User, {
          where: { username: In(item.users.map((p) => p.username)) }
        })
      }

      return trx.save<Group>(group)
    })
  }

  @Get()
  public async listGroup(
    @Query() page = 1,
    @Query() perPage = 100,
    @Query() includeUsers = false,
    @Query() includePermissions = false,
    @Query() isActive = true
  ): Promise<Paginate<Group>> {
    const skip = perPage * (page - 1)
    const manager = await getManager()
    const relations: string[] = []

    if (includeUsers) relations.push("users")
    if (includePermissions) relations.push("permissions")

    const rowsAndTotal = await manager.findAndCount(Group, {
      take: perPage,
      skip,
      relations,
      where: { isActive: Equal(isActive) }
    })

    const rows = rowsAndTotal[0]
    const total = rowsAndTotal[1]
    return { rows, page, perPage, total }
  }

  @Post()
  @SuccessResponse("201", "Created")
  @Security("jwt", ["groups:create"])
  public async createGroup(@Body() item: CreateGroupParams): Promise<Group> {
    return await getManager().transaction(async (trx) => {
      const group = trx.create(Group, {
        name: item.name,
        description: item.description
      })

      if (item.permissions) {
        group.permissions = await trx.find(Permission, {
          where: { name: In(item.permissions.map((p) => p.name)) }
        })
      }

      return trx.save<Group>(group)
    })
  }

  @Delete("{id}")
  @Security("jwt", ["groups:delete"])
  public async deleteGroup(@Path() id: number): Promise<{ affected: number }> {
    const result = await getManager().delete(Group, id)
    return { affected: result.affected || 0 }
  }
}
