import { PrismaClient } from '@prisma/client'

const users = [
    {
        username: "admin",
        fullName: "Administrator",
        groups: [{ name: "admin" }]
    },
    {
        username: "viewer",
        fullName: "User Viewer",
        groups: [{ name: "viewer" }]
    },
    {
        username: "userAdmin",
        fullName: "User Administrator",
        groups: [{ name: "userAdmin" }]
    }
]


export async function insertUsers(prisma: PrismaClient) {
    const user = await prisma.user.findFirst({ where: { username: users[0].username } })

    if (!user) {
        console.log("Insert Users")

        await prisma.$transaction(users.map(u => prisma.user.create({
            data: {
                username: u.username,
                fullName: u.fullName
            }
        })));

        const userGroups = users.flatMap(u => u.groups.map(ug => { return { username: u.username, groupName: ug.name } }))
        await prisma.$transaction(userGroups.map(u => prisma.user.update({
            where: {
                username: u.username
            },
            data: {
                userGroups: {
                    create: {
                        group: {
                            connect: {
                                name: u.groupName
                            }
                        }
                    }
                }
            }
        })));
    }
}