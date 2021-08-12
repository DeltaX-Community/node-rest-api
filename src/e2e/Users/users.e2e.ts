import { expect } from "chai"
import { agent as request } from "supertest"
import { paths } from "../../generated/schema"

export function usersDescribe(app) {
  it("GET /api/v1/users", async () => {
    // Auth
    const resAuth = await request(app).post("/auth/login").send({ password: "", username: "admin" })

    const accessToken = (resAuth.body as { accessToken: string }).accessToken
    expect(accessToken).not.to.be.empty

    const res = await request(app)
      .get("/api/v1/users")
      .auth(accessToken, { type: "bearer" })
      .query({ page: 2, perPage: 1 })
      .send()
    expect(res.status).to.equal(200)
    expect(res.body).not.to.be.empty

    type IUserGetResponse =
      paths["/api/v1/users"]["get"]["responses"]["200"]["content"]["application/json"]
    const result = res.body as IUserGetResponse

    expect(result.page).to.eq(2)
    expect(result.perPage).to.eq(1)
    expect(result.rows.length).to.eq(1)
    expect(result.rows[0].username).not.to.be.empty
    expect(result.rows[0].fullName).not.to.be.empty
    // Fixme: Test all Row fields
  })
}
