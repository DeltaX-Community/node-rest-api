import { PrismaClient } from '@prisma/client'
import { insertGroups } from './seeders/groups';
import { insertPermissions } from "./seeders/permissions"
import { insertUsers } from './seeders/users';

const prisma = new PrismaClient()

export async function seed() {
    await insertPermissions(prisma);
    await insertGroups(prisma);
    await insertUsers(prisma);
}

seed()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })