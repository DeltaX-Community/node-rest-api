import { ConnectionOptions } from "typeorm"

export const options: ConnectionOptions = {
    type: "sqlite",
    database: `data/db.sqlite`,
    entities: ["./src/entities/**.ts"],
    logging: true,
    synchronize: true,
}
