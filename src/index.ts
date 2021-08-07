import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";
import { RegisterErrorMiddleware } from './errors/errorMiddleware';
import { options } from "./config/database.confg"
import { createConnection } from "typeorm"
import version from "../version.json"

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use("/docs", swaggerUi.serve, async (_req: Request, res: Response) => {
    return res.send(
        swaggerUi.generateHTML(await import("../build/swagger.json"))
    );
});

app.get("/version", (_req, resp) => { resp.json(version) })

RegisterRoutes(app);
RegisterErrorMiddleware(app);

createConnection(options)
    .then(() => {
        app.listen(port, () =>
            console.log(`App listening at http://localhost:${port}/docs`)
        )
    })
    .catch(err => {
        console.log(`Fail to create connection Error:${err}`)
    })

