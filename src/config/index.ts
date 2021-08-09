import { ConnectionOptions } from "typeorm"
import "sqlite3"

import configDev from "./config.development.json"
import configProd from "./config.production.json"

let config = { ...configDev }
const env = process.env.NODE_ENV || "development"
const tsNode = !!process.env.TS_NODE
const production = env == "production"
const development = !production

if (tsNode) {
  config.ormconfig.entities = ["src/app/entities/**.ts"]
}

if (production) {
  config = { ...configProd }
}

const connectionConfig: ConnectionOptions = {
  ...config.ormconfig,
  type: "sqlite"
}

export { config, tsNode, connectionConfig, production, development }
