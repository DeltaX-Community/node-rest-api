import { connectionConfig } from "../config"
import { getConnection, createConnection } from "typeorm"
import { usersDescribeAdmin, usersDescribeViewer } from "./Users/users.e2e"
import { permissionsDescribe } from "./Users/users.permissions.e2e"
import { app } from "../app"

describe("End To End Tests", () => {
  before(async () => {
    return createConnection({ ...connectionConfig, logging: false })
  })

  after(() => getConnection().close())

  describe("Users as admin", () => usersDescribeAdmin(app))
  describe("Users as viewer", () => usersDescribeViewer(app))
  describe("Permissions", () => permissionsDescribe(app))
})
