import { expect } from "chai"
import { agent as request } from "supertest"
import { paths } from "../../generated/schema"

type IAuthGetResponse =
  paths["/auth/login"]["post"]["responses"]["200"]["content"]["application/json"]

type IPermissionGetParamQuery = paths["/api/v1/users/permissions"]["get"]["parameters"]["query"]

type IPermissionGetManyResponse =
  paths["/api/v1/users/permissions"]["get"]["responses"]["200"]["content"]["application/json"]

type IPermissionGetsResponse =
  paths["/api/v1/users/permissions/{id}"]["get"]["responses"]["200"]["content"]["application/json"]

type IPermissionCreateResponse =
  paths["/api/v1/users/permissions"]["post"]["responses"]["201"]["content"]["application/json"]

export function permissionsDescribe(app) {
  let resultLogin: IAuthGetResponse

  before(async () => {
    // Auth
    const res = await request(app).post("/auth/login").send({ password: "", username: "admin" })
    resultLogin = res.body as IAuthGetResponse
    expect(resultLogin.refreshToken).not.to.be.empty
    expect(resultLogin.accessToken).not.to.be.empty
  })

  it("GET /api/v1/users/permissions without Credentials", async function () {
    const res = await request(app)
      .get("/api/v1/users/permissions")
      .query({ page: 2, perPage: 1 } as IPermissionGetParamQuery)
      .send()
    expect(res.status).to.equal(401)
  })

  it("GET /api/v1/users/permissions with Credentials", async () => {
    const res = await request(app)
      .get("/api/v1/users/permissions")
      .query({ page: 2, perPage: 1 } as IPermissionGetParamQuery)
      .auth(resultLogin.accessToken, { type: "bearer" })
      .send()

    const result = res.body as IPermissionGetManyResponse
    expect(res.status).to.equal(200)
    expect(result.page).to.equal(2)
    expect(result.perPage).to.equal(1)

    expect(result.rows).not.to.be.empty
    expect(result.rows[0].createAt).not.to.be.empty
    expect(result.rows[0].updatedAt).not.to.be.empty
    expect(result.rows[0].id).to.gte(1)
    expect(result.rows[0].name).not.to.be.empty
    expect(result.rows[0].description).not.to.be.empty
  })

  it("Create, Update, Get and Delete /api/v1/users/permissions", async () => {
    // Create
    const resCreate = await request(app)
      .post("/api/v1/users/permissions")
      .auth(resultLogin.accessToken, { type: "bearer" })
      .send({
        name: "permission:prueba",
        description: "permiso de prueba"
      })

    expect(resCreate.status).to.equal(201)
    const result = resCreate.body as IPermissionCreateResponse
    expect(result.id).to.gte(1)
    expect(result.name).to.eq("permission:prueba")
    expect(result.isActive).to.eq(true)
    expect(result.description).to.eq("permiso de prueba")

    const permId = result.id

    // Update
    const resUpdate = await request(app)
      .put(`/api/v1/users/permissions/${permId}`)
      .auth(resultLogin.accessToken, { type: "bearer" })
      .send({
        isActive: false,
        description: "description modificada"
      })

    expect(resUpdate.status).to.equal(200)

    // Get
    const resGet = await request(app)
      .get(`/api/v1/users/permissions/${permId}`)
      .auth(resultLogin.accessToken, { type: "bearer" })
      .send()

    const resultGet = resGet.body as IPermissionGetsResponse

    expect(resGet.status).to.equal(200)
    expect(resultGet.id).to.eq(permId)
    expect(resultGet.name).to.eq("permission:prueba")
    expect(resultGet.isActive).to.eq(false)
    expect(resultGet.description).to.eq("description modificada")

    // Delete
    const resDelete = await request(app)
      .delete(`/api/v1/users/permissions/${permId}`)
      .auth(resultLogin.accessToken, { type: "bearer" })
      .send()

    expect(resDelete.status).to.eq(200)
  })
}
