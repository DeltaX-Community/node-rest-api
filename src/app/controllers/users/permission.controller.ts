import { Controller, Get, Path, Delete, Post, Put } from "tsoa"
import { Body, Query, Route, SuccessResponse, Security, Tags } from "tsoa"
import { permissionService } from "../../services"
import { Permission } from "../../models"
import {
  CreatePermissionParams,
  UpdatePermissionParams,
  IPermissionDetail,
  IPermissionList
} from "../../dtos"

@Route("api/v1/users/permissions")
@Tags("Users")
export class PermissionController extends Controller {
  @Get("{id}")
  @Security("jwt", ["permissions:read"])
  public async getPermissionDetail(@Path() id: number): Promise<IPermissionDetail> {
    return await permissionService.getPermissionDetail(id)
  }

  @Put("{id}")
  @Security("jwt", ["permissions:update"])
  public async updatePermission(
    @Path() id: number,
    @Body() item: UpdatePermissionParams
  ): Promise<Permission> {
    return await permissionService.updatePermission(id, item)
  }

  @Get("")
  @Security("jwt", ["permissions:read"])
  public async listPermissions(
    @Query() page = 1,
    @Query() perPage = 10,
    @Query() username: string | null = null,
    @Query() isActive = true
  ): Promise<IPermissionList> {
    return await permissionService.getPermissionList(page, perPage, username, isActive)
  }

  @SuccessResponse("201", "Created")
  @Post()
  @Security("jwt", ["permissions:create"])
  public async createPermission(@Body() item: CreatePermissionParams): Promise<Permission> {
    this.setStatus(201)
    return await permissionService.createPermission(item)
  }

  @Delete("{id}")
  @Security("jwt", ["permissions:delete"])
  public async deletePermission(@Path() id: number): Promise<Permission> {
    return await permissionService.deletePermission(id)
  }
}
