import express from "express";
import { RegisterRoutes } from "../generated/routes";
import { RegisterErrorMiddleware } from './errors/errorMiddleware';
import version from "../generated/version.json"

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/version", (_req, resp) => { resp.json(version) })

RegisterRoutes(app);
RegisterErrorMiddleware(app);

export {
    app
};
