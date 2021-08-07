import { Body, Controller, Get, Path, Post, Put, Query, Route, SuccessResponse, Security, Tags } from "tsoa";
import { CreateGroupParams, UpdateGroupParams } from "../../dtos/group.dto";
import { Paginate } from "../../dtos/paginate.dto";
import { Equal, getManager, In } from "typeorm"
import { Group } from "../../entities/group";
import { Permission } from "../../entities/permission";
import { User } from "../../entities/user";


@Route("users/groups")
@Tags("Users")
export class RoleController extends Controller {

    @Get("{id}")
    public async getGroup(
        @Path() id: number
    ): Promise<Group | any> {
        return getManager().findOneOrFail(Group, id, { relations: ["users", "permissions"] });
    }

    @Put("{id}")
    /// @Security("jwt", ["admin"])
    public async updateGroup(
        @Path() id: number,
        @Body() item: UpdateGroupParams
    ): Promise<Group> {
        return await getManager().transaction(async (trx) => {
            const group = await trx.findOneOrFail(Group, id, { relations: ["users", "permissions"] });

            if (item.permissions) {
                group.permissions = await trx.find(Permission, { where: { "name": In(item.permissions.map(p => p.name)) } });
            }

            if (item.users) {
                group.users = await trx.find(User, { where: { "username": In(item.users.map(p => p.username)) } });
            }

            return trx.save<Group>(group)
        })
    }

    @Get()
    public async listGroup(
        @Query() page: number = 1,
        @Query() perPage: number = 100,
        @Query() includeUsers: boolean = false,
        @Query() includePermissions: boolean = false,
    ): Promise<Paginate<Group>> {
        const skip = perPage * (page - 1);
        const manager = await getManager()
        const relations = [];
        if (includeUsers) relations.push("users")
        if (includePermissions) relations.push("permissions")
        const rows = await manager.find(Group, { take: perPage, skip, relations });
        const total = await manager.count(Group)
        return { rows, page, perPage, total }
    }

    @Post()
    @SuccessResponse("201", "Created")
    public async createGroup(
        @Body() item: CreateGroupParams
    ): Promise<Group> {
        return await getManager().transaction(async (trx) => {
            const group = trx.create(Group, { name: item.name, description: item.description })

            if (item.permissions) {
                group.permissions = await trx.find(Permission, { where: { "name": In(item.permissions.map(p => p.name)) } });
            }

            return trx.save<Group>(group)
        })
    }
}