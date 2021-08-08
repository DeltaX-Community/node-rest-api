import { EntityManager, Equal, In } from "typeorm";
import { User } from "../app/entities/user"
import { Group } from "../app/entities/group"

const users = [
    {
        username: "admin", fullName: "Administrator",
        groups: [{ name: "admin" }]
    },
    {
        username: "viewer", fullName: "User Viewer",
        groups: [{ name: "viewer" }]
    },
    {
        username: "userAdmin", fullName: "User Administrator",
        groups: [{ name: "userAdmin" }]
    },
] as User[];


export async function initUsers(tran: EntityManager) {

    const item = await tran.findOne(User, { where: { "username": Equal(users[0].username) } });
    if (item == null) {

        // Find permission from DB
        const tasks = users.map(async u => {
            u.groups = await tran.find(Group, { where: { name: In(u.groups?.map(p => p.name) || []) } })
        })
        // Wait for all task
        await Promise.all(tasks)

        await tran.save(User, users);
    }
}