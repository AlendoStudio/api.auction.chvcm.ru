import "../global";

import * as debug from "debug";

if (process.env.DEBUG) {
  debug.enable(process.env.DEBUG);
}

import {PgEnumUnitCacheMemory, PgEnumUnitClient} from "@alendo/express-req-validator";

import MockAdapter from "axios-mock-adapter";
import {afterEach, beforeEach} from "mocha";

import {EmailNotifications, PgMigrate, Recaptcha2, RedisClient, Sequelize, Web} from "../src";

export let reCaptchaMockAdapter: MockAdapter;

beforeEach(async () => {
  RedisClient.instantiate();
  await RedisClient.flushdb();

  EmailNotifications.instantiateSmtp();

  Sequelize.instantiateWeb();
  PgEnumUnitClient.instantiate(Sequelize.instance);
  PgEnumUnitCacheMemory.instantiate();

  await Sequelize.instance.query("CREATE SCHEMA IF NOT EXISTS public;");
  await Sequelize.instance.query("DROP SCHEMA public CASCADE;");
  await Sequelize.instance.query("CREATE SCHEMA public;");
  await new PgMigrate().upPending();

  Web.instantiate();
  reCaptchaMockAdapter = new MockAdapter(Recaptcha2.AXIOS);

  await Web.instance.listen();
});

afterEach(async () => {
  await Web.instance.close();
  await Sequelize.instance.close();
  await RedisClient.close();
  reCaptchaMockAdapter.restore();
});

process.on("uncaughtException", (error) => {
  // tslint:disable no-console
  console.error(error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  // tslint:disable no-console
  console.error(error);
  process.exit(1);
});
