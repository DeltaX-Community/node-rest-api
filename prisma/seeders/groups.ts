import { PrismaClient } from '@prisma/client'
import { permissions } from "./permissions"

const groups = [
    {
        name: "admin",
        description: "Administrator",
        // The admin group not need find permission
        permissions: []
    },
    {
        name: "viewer",
        description: "Visualizacion",
        permissions: permissions
            .filter((p) => p.name.endsWith(":read"))
            .map((p) => {
                return { name: p.name }
            })
    },
    {
        name: "userAdmin",
        description: "Administrador de Usuario y grupos",
        permissions: permissions
            .filter((p) => p.name.startsWith("users:") || p.name.startsWith("groups:"))
            .map((p) => {
                return { name: p.name }
            })
    }
]


export async function insertGroups(prisma: PrismaClient) {
    const group = await prisma.group.findFirst({ where: { name: groups[0].name } })

    if (!group) {
        console.log("Insert Groups")
        let groupsPerms = groups.flatMap(g => g.permissions.map(p => {
            return {
                name: g.name,
                description: g.description,
                permName: p.name
            }
        }))

        await prisma.$transaction(groups.map(g => prisma.group.create({
            data: { name: g.name, description: g.description }
        })));

        await prisma.$transaction(groupsPerms.map(g => prisma.group.update({
            where: {
                name: g.name
            },
            data: {
                permissions: {
                    connect: {
                        name: g.permName
                    }
                }
            }
        })));
    }
}