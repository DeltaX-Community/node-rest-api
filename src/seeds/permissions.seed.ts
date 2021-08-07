import { EntityManager, Equal } from "typeorm";
import { Permission } from "../entities/permission"

export const permissions = [
    { name: "user:create", description: "Create Users" },
    { name: "user:update", description: "Update User" },
    { name: "user:read", description: "Read User" },
    { name: "user:delete", description: "Delete User" },

    { name: "group:create", description: "Create Group" },
    { name: "group:update", description: "Update Group" },
    { name: "group:read", description: "Read Group" },
    { name: "group:delete", description: "Delete Group" },

    { name: "permission:create", description: "Create Permission" },
    { name: "permission:update", description: "Update Permission" },
    { name: "permission:read", description: "Read Permission" },
    { name: "permission:delete", description: "Delete Permission" },
] as Permission[];


export async function initPermissions(tran: EntityManager) {
    const perm = await tran.findOne(Permission, { where: { "name": Equal(permissions[0].name) } });
    if (perm == null) {
        await tran.save(Permission, permissions);
    }
}