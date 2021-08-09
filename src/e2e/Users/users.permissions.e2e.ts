import { expect } from "chai"
import { agent as request } from "supertest"

export function permissionsDescribe(app) {
  it("GET /api/v1/users/permissions without Credentials", async function () {
    const res = await request(app)
      .get("/api/v1/users/permissions")
      .query({ page: 2, perPage: 1 })
      .send()
    expect(res.status).to.equal(401)
  })

  it("GET /api/v1/users/permissions with Credentials", async () => {
    const resAuth = await request(app).post("/auth/login").send({ password: "", username: "admin" })

    const accessToken = resAuth.body.accessToken as string
    expect(accessToken).not.to.be.empty

    const res = await request(app)
      .get("/api/v1/users/permissions")
      .query({ page: 2, perPage: 1 })
      .auth(accessToken, { type: "bearer" })
      .send()

    expect(res.status).to.equal(200)
    expect(res.body.rows).not.to.be.empty
  })

  it("Create, Update and Remove /api/v1/users/permissions", async () => {
    // Auth
    const resAuth = await request(app).post("/auth/login").send({ password: "", username: "admin" })

    const accessToken = resAuth.body.accessToken as string
    expect(accessToken).not.to.be.empty

    // Create
    const resCreate = await request(app)
      .post("/api/v1/users/permissions")
      .auth(accessToken, { type: "bearer" })
      .send({
        name: "permission:preuba",
        description: "permiso de prueba"
      })

    expect(resCreate.status).to.equal(201)
    expect(resCreate.body.id).to.gte(1)
    expect(resCreate.body.name).to.eq("permission:preuba")
    expect(resCreate.body.isActive).to.eq(true)

    const permId = resCreate.body.id as number

    // Update
    const resUpdate = await request(app)
      .put(`/api/v1/users/permissions/${resCreate.body.id}`)
      .auth(accessToken, { type: "bearer" })
      .send({
        isActive: false,
        description: "description modificada"
      })

    expect(resUpdate.status).to.equal(200)

    // Get
    const resGet = await request(app)
      .get(`/api/v1/users/permissions/${permId}`)
      .auth(accessToken, { type: "bearer" })
      .send()

    expect(resGet.status).to.equal(200)
    expect(resGet.body.id).to.eq(permId)
    expect(resGet.body.name).to.eq("permission:preuba")
    expect(resGet.body.isActive).to.eq(false)
    expect(resGet.body.description).to.eq("description modificada")

    // Delete
    const resDelete = await request(app)
      .delete(`/api/v1/users/permissions/${permId}`)
      .auth(accessToken, { type: "bearer" })
      .send()

    expect(resDelete.status).to.equal(200)
    expect(resDelete.body.affected).to.gte(0)
  })
}
