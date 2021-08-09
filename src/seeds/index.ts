import { connectionConfig } from "../config"
import { createConnection, getManager } from "typeorm"
import { initPermissions } from "./permissions.seed"
import { initGroups } from "./groups.seed"
import { initUsers } from "./users.seed"

const databaseOptions = {
  logging: true,
  synchronize: true
}

console.log("*** Initialize Database Schema ***")
createConnection({ ...connectionConfig, ...databaseOptions })
  .then(() =>
    getManager().transaction(async (tran) => {
      console.log("*** Connected Database")

      console.log("*** Initialize Permissions")
      await initPermissions(tran)

      console.log("*** Initialize Groups")
      await initGroups(tran)

      console.log("*** Initialize Users")
      await initUsers(tran)

      console.log("*** END ***")
    })
  )
  .catch((err) => {
    console.log(`Fail to create connection Error:${err}`)
  })
