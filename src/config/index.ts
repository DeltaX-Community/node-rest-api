import configDev from "./config.development.json"
import configProd from "./config.production.json"

let config = { ...configDev }
const env = process.env.NODE_ENV || "development"
const tsNode = !!process.env.TS_NODE
const production = env == "production"
const development = !production

if (tsNode) {
  config.ormconfig.entities = config.ormconfig.entities.map((e) =>
    e.endsWith(".js") ? (e.substr(0, e.length - 3) + ".ts").replace("build/", "src/") : e
  )
}

if (production) {
  config = { ...configProd }
}

export { config, tsNode, production, development }
