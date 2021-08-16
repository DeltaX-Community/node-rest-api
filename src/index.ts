import { Request, Response } from "express"
import swaggerUi from "swagger-ui-express"
import { PrismaClient } from "@prisma/client"
import { app } from "./app"
import { PORT } from "./config"

const prisma = new PrismaClient()

app.use("/docs", swaggerUi.serve, async (_req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(await import("./generated/swagger.json")))
})

prisma
  .$connect()
  .then(() => {
    app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}/docs`))
  })
  .catch((err) => {
    console.log(`Fail to create connection Error:${err}`)
  })
