import { Request, Response } from "express"
import swaggerUi from "swagger-ui-express"
import { PrismaClient } from "@prisma/client"
import { app } from "./app"

const prisma = new PrismaClient()

const port = process.env.PORT || 3000

app.use("/docs", swaggerUi.serve, async (_req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(await import("./generated/swagger.json")))
})

prisma
  .$connect()
  .then(() => {
    app.listen(port, () => console.log(`App listening at http://localhost:${port}/docs`))
  })
  .catch((err) => {
    console.log(`Fail to create connection Error:${err}`)
  })
