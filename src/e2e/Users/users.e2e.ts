import { expect } from "chai"
import { agent as request } from "supertest"
import { paths } from "../../generated/schema"

type IAuthGetResponse =
  paths["/auth/login"]["post"]["responses"]["200"]["content"]["application/json"]

type IUserGetResponse =
  paths["/api/v1/users"]["get"]["responses"]["200"]["content"]["application/json"]

export function usersDescribeViewer(app) {
  let resultLogin: IAuthGetResponse

  before(async () => {
    // Auth
    const res = await request(app).post("/auth/login").send({ password: "", username: "viewer" })
    resultLogin = res.body as IAuthGetResponse
    expect(resultLogin.refreshToken).not.to.be.empty
    expect(resultLogin.accessToken).not.to.be.empty
  })

  it("GET /api/v1/users", async () => {
    const res = await request(app)
      .get("/api/v1/users")
      .auth(resultLogin.accessToken, { type: "bearer" })
      .query({ page: 2, perPage: 1 })
      .send()
    expect(res.status).to.equal(200)
    expect(res.body).not.to.be.empty

    const result = res.body as IUserGetResponse

    expect(result.page).to.eq(2)
    expect(result.perPage).to.eq(1)
    expect(result.rows.length).to.eq(1)
    expect(result.rows[0].username).not.to.be.empty
    expect(result.rows[0].fullName).not.to.be.empty
    expect(result.rows[0].updatedAt).not.to.be.empty
    expect(result.rows[0].createAt).not.to.be.empty
    expect(result.rows[0].isActive).to.eq(true)
    // Fixme: Test all Row fields
  })

  it("POST /api/v1/users", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .auth(resultLogin.accessToken, { type: "bearer" })
      .send()

    expect(res.status).to.equal(403)
  })

  it("DELETE /api/v1/users/0", async () => {
    const res = await request(app)
      .delete("/api/v1/users/0")
      .auth(resultLogin.accessToken, { type: "bearer" })
      .send()

    expect(res.status).to.equal(403)
  })
}

export function usersDescribeAdmin(app) {
  let resultLogin: IAuthGetResponse

  before(async () => {
    // Auth
    const res = await request(app).post("/auth/login").send({ password: "", username: "admin" })
    resultLogin = res.body as IAuthGetResponse
    expect(resultLogin.refreshToken).not.to.be.empty
    expect(resultLogin.accessToken).not.to.be.empty
    return
  })

  it("GET /api/v1/users", async () => {
    const res = await request(app)
      .get("/api/v1/users")
      .auth(resultLogin.accessToken, { type: "bearer" })
      .query({ page: 2, perPage: 1 })
      .send()
    expect(res.status).to.equal(200)
    expect(res.body).not.to.be.empty

    const result = res.body as IUserGetResponse

    expect(result.page).to.eq(2)
    expect(result.perPage).to.eq(1)
    expect(result.rows.length).to.eq(1)
    expect(result.rows[0].username).not.to.be.empty
    expect(result.rows[0].fullName).not.to.be.empty
    expect(result.rows[0].updatedAt).not.to.be.empty
    expect(result.rows[0].createAt).not.to.be.empty
    expect(result.rows[0].isActive).to.eq(true)
    // Fixme: Test all Row fields
  })

  it("POST /api/v1/users", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .auth(resultLogin.accessToken, { type: "bearer" })
      .send()

    expect(res.status).to.equal(422)
  })

  it("DELETE /api/v1/users/0", async () => {
    const res = await request(app)
      .delete("/api/v1/users/0")
      .auth(resultLogin.accessToken, { type: "bearer" })
      .send()

    expect(res.status).to.equal(500)
  })
}
