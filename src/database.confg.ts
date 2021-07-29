import { ConnectionOptions } from "typeorm"
import { User } from "./entities/user"

export const options: ConnectionOptions = {
    type: "sqlite",
    database: `data/db.sqlite`,
    entities: [User],
    logging: true,
    synchronize: true,
}
