import {baseDir} from "../global";

import * as fs from "fs";
import * as path from "path";

import * as debug from "debug";
import "mocha";
import natsort from "natsort";

if (process.env.DEBUG) {
  debug.enable(process.env.DEBUG);
}

import {EmailNotifications, Sequelize, Web} from "../src";

let beforeAll = true;

export function prepareApi(): void {
  prepareApi.beforeEach();
  prepareApi.afterEach();
}

async function migrateAll(): Promise<void> {
  const migrationsPath = path.join(baseDir, "db", "migrations");
  const files = (await fs.promises.readdir(migrationsPath))
    .filter((file) => /^.*\.sql$/.test(file))
    .sort(natsort())
    .map((file) => path.join(migrationsPath, file));
  for (const file of files) {
    await Sequelize.instance.query(await fs.promises.readFile(file, "utf8"));
  }
}

prepareApi.beforeEach = () => {
  beforeEach(async () => {
    EmailNotifications.instantiateSmtp();
    Sequelize.instantiate();
    Web.instantiate();

    if (beforeAll) {
      await Sequelize.instance.query(`
      CREATE SCHEMA IF NOT EXISTS public;
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;`);
      await migrateAll();
      beforeAll = false;
    } else {
      await Sequelize.instance.query(
        "TRUNCATE users_common, stuffs RESTART IDENTITY CASCADE;",
      );
    }

    await Web.instance.listen();
  });
};

prepareApi.afterEach = () => {
  afterEach(async () => {
    await Web.instance.close();
    await Sequelize.instance.close();
    EmailNotifications.instance.close();
  });
};

process.on("uncaughtException", (error) => {
  console.error(error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error(error);
  process.exit(1);
});
