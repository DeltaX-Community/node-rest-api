import { Equal, In, EntityManager } from "typeorm";
import { Group } from "../app/entities/group"
import { Permission } from "../app/entities/permission"
import { permissions } from "./permissions.seed";


let groups = [
    {
        name: "admin", description: "Administrator",
        // The admin group not need find permission
        permissions: []
    },
    {
        name: "viewer", description: "Visualizacion",
        permissions: permissions.filter(p => p.name.endsWith(':read')).map(p => { return { name: p.name } })
    },
    {
        name: "userAdmin", description: "Administrador de Usuario y grupos",
        permissions: permissions.filter(p => p.name.startsWith('usesr:') || p.name.startsWith("grosup:"))
            .map(p => { return { name: p.name } })
    },
] as Group[];


export async function initGroups(tran: EntityManager) {

    var gAdmin = await tran.findOne(Group, { where: { name: Equal(groups[0].name) } });
    if (gAdmin == null) {

        // Find permission from DB
        const tasks = groups.map(async g => {
            g.permissions = await tran.find(Permission, { where: { name: In(g.permissions?.map(p => p.name) || []) } })
        })
        // Wait for all task
        await Promise.all(tasks)

        await tran.save(Group, groups);
    }
}