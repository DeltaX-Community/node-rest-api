import { connectionConfig } from "../config"
import { getConnection, createConnection } from 'typeorm';
import { usersDescribe } from "./Users/users.e2e"
import { permissionsDescribe } from "./Users/users.permissions.e2e"
import { app } from "../app";

describe('End To End Tests', () => {

  before(async () => { return createConnection({ ...connectionConfig, logging: false }) });

  after(() => getConnection().close());

  describe('Users', () => usersDescribe(app));
  describe('Permissions', () => permissionsDescribe(app));

});

