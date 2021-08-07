import { Body, Controller, Get, Path, Post, Put, Query, Route, SuccessResponse, Tags, Security } from "tsoa";
import { Permission } from "../../entities/permission";
import { Paginate } from "../../dtos/paginate.dto";
import { getManager } from "typeorm"
import { CreatePermissionParams, UpdatePermissionParams } from "../../dtos/permission.dto";


@Route("users/permissions")
@Tags("Users")
export class PermissionController extends Controller {

    @Get("{id}")
    @Security("jwt", ["admin"])
    @Security("jwt", ['permission:read'])
    public async getPermission(
        @Path() id: number
    ): Promise<Permission> {
        return getManager().findOneOrFail(Permission, id);
    }

    @Put("{id}")
    public async updatePermission(
        @Path() id: number,
        @Body() item: UpdatePermissionParams
    ): Promise<Permission> {
        var manager = await getManager()
        const perm = await manager.findOneOrFail(Permission, id)
        perm.description = item.description || "";
        return manager.save<Permission>(perm)
    }

    @Get("")
    @Security("jwt", ['permission:read'])
    public async listPermissions(
        @Query() page: number = 1,
        @Query() perPage: number = 10
    ): Promise<Paginate<Permission>> {
        const skip = perPage * (page - 1);
        const manager = await getManager()
        const rows = await manager.find(Permission, { take: perPage, skip });
        const total = await manager.count(Permission)
        return { rows, page, perPage, total }
    }

    @SuccessResponse("201", "Created")
    @Post()
    public async createPermission(
        @Body() item: CreatePermissionParams
    ): Promise<Permission> {
        var manager = await getManager()
        const newItem = manager.create(Permission, item)
        return manager.save<Permission>(newItem)
    }
}

