import { PrismaClient, Group, UserGroups } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  // await prisma.user.create({
  //   data: {
  //     name: 'Alice',
  //     email: 'alice@prisma.io',
  //     posts: {
  //       create: { title: 'Hello World' },
  //     },
  //     profile: {
  //       create: { bio: 'I like turtles' },
  //     },
  //   },
  // })

  const allUsers = await prisma.user.findMany({
    include: {
      photos: true,
      userGroups: {
        include: {
          group: true
        }
      }
    }
  })
  console.log("allUsers")
  console.log(allUsers)
  console.log(allUsers[0].updatedAt)

  const userGroups = allUsers[0].userGroups as (UserGroups & { group: Group })[]
  const ug = userGroups as { group: Group }[]
  console.log(ug[0].group, typeof allUsers[0].userGroups, typeof ug[0], typeof ug[0].group)
}

main()
  .catch((e) => {
    throw e
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect()
  })
