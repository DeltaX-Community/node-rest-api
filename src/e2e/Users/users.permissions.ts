import { expect } from 'chai';
import { agent as request } from 'supertest';
import { app } from "../../app"


export function permissionsDescribe() {
  it('GET /users/permissions without Credentials', async function () {
    const res = await request(app)
      .get('/users/permissions')
      .query({ page: 2, perPage: 1 })
      .send();
    expect(res.status).to.equal(401);
  });
}