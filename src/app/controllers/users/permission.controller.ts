import { Controller, Get, Path, Delete, Post, Put } from "tsoa"
import { Body, Query, Route, SuccessResponse, Security, Tags } from "tsoa"
import { permissionService } from "../../services"
import {
  CreatePermissionDto,
  UpdatePermissionDto,
  PermissionDetailDto,
  PermissionListDto,
  PermissionDto
} from "../../dtos"

@Route("api/v1/users/permissions")
@Tags("Users")
export class PermissionController extends Controller {
  @Get("{id}")
  @Security("jwt", ["permissions:read"])
  public async getPermissionDetail(@Path() id: number): Promise<PermissionDetailDto> {
    return await permissionService.getPermissionDetail(id)
  }

  @Put("{id}")
  @Security("jwt", ["permissions:update"])
  public async updatePermission(
    @Path() id: number,
    @Body() item: UpdatePermissionDto
  ): Promise<PermissionDto> {
    return await permissionService.updatePermission(id, item)
  }

  @Get("")
  @Security("jwt", ["permissions:read"])
  public async getPermissionList(
    @Query() page = 1,
    @Query() perPage = 10,
    @Query() username: string | null = null,
    @Query() isActive = true
  ): Promise<PermissionListDto> {
    return await permissionService.getPermissionList(page, perPage, username, isActive)
  }

  @SuccessResponse("201", "Created")
  @Post()
  @Security("jwt", ["permissions:create"])
  public async createPermission(@Body() item: CreatePermissionDto): Promise<PermissionDto> {
    this.setStatus(201)
    return await permissionService.createPermission(item)
  }

  @Delete("{id}")
  @Security("jwt", ["permissions:delete"])
  public async deletePermission(@Path() id: number): Promise<PermissionDto> {
    return await permissionService.deletePermission(id)
  }
}
