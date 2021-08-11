import { Controller, Get, Path, Delete, Post, Put } from "tsoa"
import { Body, Query, Route, SuccessResponse, Security, Tags } from "tsoa"
import { Permission } from "../../entities"
import { Paginate } from "../../dtos/paginate.dto"
import { Equal, getManager } from "typeorm"
import { CreatePermissionParams, UpdatePermissionParams } from "../../dtos/permission.dto"

@Route("api/v1/users/permissions")
@Tags("Users")
export class PermissionController extends Controller {
  @Get("{id}")
  @Security("jwt", ["permissions:read"])
  public async getPermission(@Path() id: number): Promise<Permission> {
    return getManager().findOneOrFail(Permission, id)
  }

  @Put("{id}")
  @Security("jwt", ["permissions:update"])
  public async updatePermission(
    @Path() id: number,
    @Body() item: UpdatePermissionParams
  ): Promise<Permission> {
    const manager = getManager()
    const perm = await manager.findOneOrFail(Permission, id)

    perm.description = item.description || ""

    if (item.isActive != undefined) {
      perm.isActive = item.isActive
    }

    return manager.save<Permission>(perm)
  }

  @Get("")
  @Security("jwt", ["permissions:read"])
  public async listPermissions(
    @Query() page = 1,
    @Query() perPage = 10,
    @Query() isActive = true
  ): Promise<Paginate<Permission>> {
    const skip = perPage * (page - 1)
    const manager = getManager()

    const rowsAndTotal = await manager.findAndCount(Permission, {
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
  @Security("jwt", ["permissions:create"])
  public async createPermission(@Body() item: CreatePermissionParams): Promise<Permission> {
    const manager = getManager()
    const newItem = manager.create(Permission, item)

    this.setStatus(201)
    return manager.save<Permission>(newItem)
  }

  @Delete("{id}")
  @Security("jwt", ["permissions:delete"])
  public async deletePermission(@Path() id: number): Promise<{ affected: number }> {
    const result = await getManager().delete(Permission, id)
    return { affected: result.affected || 0 }
  }
}
