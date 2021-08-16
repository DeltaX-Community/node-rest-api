import { PrismaClient } from '@prisma/client'

export const permissions = [
    { name: "users:create", description: "Create Users" },
    { name: "users:update", description: "Update Users" },
    { name: "users:read", description: "Read Users" },
    { name: "users:delete", description: "Delete Users" },

    { name: "groups:create", description: "Create Groups" },
    { name: "groups:update", description: "Update Groups" },
    { name: "groups:read", description: "Read Groups" },
    { name: "groups:delete", description: "Delete Groups" },

    { name: "permissions:create", description: "Create Permissions" },
    { name: "permissions:update", description: "Update Permissions" },
    { name: "permissions:read", description: "Read Permissions" },
    { name: "permissions:delete", description: "Delete Permissions" }
]


export async function insertPermissions(prisma: PrismaClient) {
    const perm = await prisma.permission.findFirst({ where: { name: permissions[0].name } })

    if (!perm) {
        console.log("Insert Permission")
        await prisma.$transaction(permissions
            .map(p => prisma.permission.create({ data: { name: p.name, description: p.description } })))
    }
}