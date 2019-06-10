#!/usr/bin/env node

import {baseDir} from "../global";
import "./_logger";

import * as fs from "fs";
import * as path from "path";

import * as yargs from "yargs";

import {Sequelize} from "src";

yargs.epilog(`Create database from "schema-up.sql"`).parse();

Sequelize.instantiate();

(async () => {
  const sqlPath = path.join(baseDir, "db", "schema-up.sql");
  await Sequelize.instance.query(await fs.promises.readFile(sqlPath, "utf8"));
  await Sequelize.instance.close();
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
