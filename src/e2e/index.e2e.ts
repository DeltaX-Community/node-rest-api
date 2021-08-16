import { usersDescribeAdmin, usersDescribeViewer } from "./Users/users.e2e"
import { permissionsDescribe } from "./Users/users.permissions.e2e"
import { app } from "../app"
import { prisma } from "../app/models"

describe("End To End Tests", () => {
  before(async () => {
    return prisma.$connect()
  })

  after(() => prisma.$disconnect())

  describe("Users as admin", () => usersDescribeAdmin(app))
  describe("Users as viewer", () => usersDescribeViewer(app))
  describe("Permissions", () => permissionsDescribe(app))
})
