import { PrismaClient, User, Permission, Group, UserGroups, Photo } from "@prisma/client"

const prisma = new PrismaClient()

export { prisma, User, Group, UserGroups, Permission, Photo }
