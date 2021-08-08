import assert from 'assert';
import { expect } from 'chai';
import { agent as request } from 'supertest';
import { app } from "../../app"
import { Paginate } from "../../app/dtos/paginate.dto";
import { User } from "../../app/entities/user";

export function usersDescribe() {
  it('GET /users', async () => {
    const res = await request(app)
      .get('/users')
      .query({ page: 2, perPage: 1 })
      .send();
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    const result = res.body as Paginate<User>;
    expect(result.page).to.eq(2);
    expect(result.perPage).to.eq(1);
    expect(result.rows.length).to.eq(1);
  });
}
