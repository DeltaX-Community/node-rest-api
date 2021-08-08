import { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { connectionConfig } from "./config"
import { createConnection } from "typeorm"
import { app } from "./app"

const port = process.env.PORT || 3000;

app.use("/docs", swaggerUi.serve, async (_req: Request, res: Response) => {
    return res.send(
        swaggerUi.generateHTML(await import("./generated/swagger.json"))
    );
});

createConnection(connectionConfig)
    .then(() => {
        app.listen(port, () =>
            console.log(`App listening at http://localhost:${port}/docs`)
        )
    })
    .catch(err => {
        console.log(`Fail to create connection Error:${err}`)
    })

