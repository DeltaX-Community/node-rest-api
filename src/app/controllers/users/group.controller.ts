import { Controller, Get, Path, Delete, Post, Put } from "tsoa"
import { Body, Query, Route, SuccessResponse, Security, Tags } from "tsoa"
import { CreateGroupParams, UpdateGroupParams, IGroupDetail, IGroupList } from "../../dtos"
import { Group } from "../../models"
import { groupService } from "../../services"

@Route("api/v1/users/groups")
@Tags("Users")
export class RoleController extends Controller {
  @Get("{id}")
  @Security("jwt", ["groups:read"])
  public async getGroupDetail(@Path() id: number): Promise<IGroupDetail> {
    return await groupService.getGroupDetail(id)
  }

  @Put("{id}")
  @Security("jwt", ["groups:update"])
  public async updateGroup(
    @Path() id: number,
    @Body() item: UpdateGroupParams
  ): Promise<IGroupDetail> {
    return await groupService.updateGroup(id, item)
  }

  @Get()
  public async getGroupList(
    @Query() page = 1,
    @Query() perPage = 100,
    @Query() isActive = true
  ): Promise<IGroupList> {
    return await groupService.getGroupList(page, perPage, isActive)
  }

  @Post()
  @SuccessResponse("201", "Created")
  @Security("jwt", ["groups:create"])
  public async createGroup(@Body() item: CreateGroupParams): Promise<Group> {
    this.setStatus(201)
    return await groupService.createGroup(item)
  }

  @Delete("{id}")
  @Security("jwt", ["groups:delete"])
  public async deleteGroup(@Path() id: number): Promise<Group> {
    return await groupService.deleteGroup(id)
  }
}
