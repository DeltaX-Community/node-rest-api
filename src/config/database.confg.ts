import { ConnectionOptions } from "typeorm"

export const options: ConnectionOptions = {
    type: "sqlite",
    database: `data/db-v2.sqlite`,
    entities: ["./src/entities/**.ts"],
    logging: true,
    synchronize: false,
}
