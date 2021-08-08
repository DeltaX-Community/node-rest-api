import { connectionConfig } from "../../config"
import { getConnection, createConnection } from 'typeorm';
import { usersDescribe } from "./users"
import { permissionsDescribe } from "./users.permissions"


describe('End To End Tests', () => {

  before(async () => { return createConnection({ ...connectionConfig, logging: false }) });

  after(() => getConnection().close());

  describe('Users', usersDescribe);
  describe('Permissions', permissionsDescribe);

});
