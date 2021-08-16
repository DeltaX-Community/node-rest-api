import { User } from "../../models"
import { Body, Controller, Get, Path, Post, Put, Query, Delete } from "tsoa"
import { Route, SuccessResponse, Security, Tags } from "tsoa"
import { IUserDetail, UpdateUserParams, IUserList, CreateUserParams } from "../../dtos"
import { userService } from "../../services"

@Route("api/v1/users")
@Tags("Users")
export class UsersController extends Controller {
  @Get("{id}")
  @Security("jwt")
  public getUser(@Path() id: number): Promise<IUserDetail> {
    return userService.getUserDetail(id)
  }

  @Put("{id}")
  @Security("jwt", ["userAdmin", "users:update"])
  public async updateUser(
    @Path() id: number,
    @Body() item: UpdateUserParams
  ): Promise<IUserDetail> {
    return await userService.updateUser(id, item)
  }

  @Get("")
  @Security("jwt", ["userAdmin", "users:read"])
  public async listUsers(
    @Query() page = 1,
    @Query() perPage = 10,
    @Query() isActive = true
  ): Promise<IUserList> {
    return userService.listUsers(page, perPage, isActive)
  }

  @SuccessResponse("201", "Created")
  @Post()
  @Security("jwt", ["userAdmin", "users:create"])
  public async createUser(@Body() requestBody: CreateUserParams): Promise<User> {
    this.setStatus(201)
    return userService.createUser(requestBody)
  }

  @Delete("{id}")
  @Security("jwt", ["userAdmin", "users:delete"])
  public async deleteUser(@Path() id: number): Promise<User> {
    return userService.deleteUser(id)
  }
}
