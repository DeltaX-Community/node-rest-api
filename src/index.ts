import express from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";
import { RegisterErrorMiddleware } from './errors/errorMiddleware';
import { options } from "./database.confg"
import { createConnection } from "typeorm"
import authRoute from "./auth/authRoute"

const port = process.env.PORT || 3000;
const app = express();

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: "/swagger.json",
        },
    })
);

app.use(express.json());
app.use(express.static("public"));
app.use(authRoute);
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

