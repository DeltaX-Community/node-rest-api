import { Body, Controller, Get, Path, Post, Put, Query, Delete } from "tsoa"
import { Route, SuccessResponse, Security, Tags } from "tsoa"
import { UserDetailDto, UpdateUserDto, UserListDto, CreateUserDto, UserDto } from "../../dtos"
import { userService } from "../../services"

@Route("api/v1/users")
@Tags("Users")
export class UsersController extends Controller {
  @Get("{id}")
  @Security("jwt")
  public getUserDetail(@Path() id: number): Promise<UserDetailDto> {
    return userService.getUserDetail(id)
  }

  @Put("{id}")
  @Security("jwt", ["userAdmin", "users:update"])
  public async updateUser(@Path() id: number, @Body() item: UpdateUserDto): Promise<UserDetailDto> {
    return await userService.updateUser(id, item)
  }

  @Get("")
  @Security("jwt", ["userAdmin", "users:read"])
  public async getUserList(
    @Query() page = 1,
    @Query() perPage = 10,
    @Query() isActive = true
  ): Promise<UserListDto> {
    return userService.getUserList(page, perPage, isActive)
  }

  /**
   * Hola mundo
   */
  @SuccessResponse("201", "Created")
  @Post()
  @Security("jwt", ["userAdmin", "users:create"])
  public async createUser(@Body() requestBody: CreateUserDto): Promise<UserDto> {
    this.setStatus(201)
    return userService.createUser(requestBody)
  }

  @Delete("{id}")
  @Security("jwt", ["userAdmin", "users:delete"])
  public async deleteUser(@Path() id: number): Promise<UserDto> {
    return userService.deleteUser(id)
  }
}
