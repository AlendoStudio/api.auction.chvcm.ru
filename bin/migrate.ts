#!/usr/bin/env node

import "../global";

import {PgMigrate, Sequelize} from "src";

(async () => {
  // TODO: cli tool here
  Sequelize.instantiateWorker();
  const pgMigrate = new PgMigrate();
  await pgMigrate.upPending();
  await Sequelize.instance.close();
})();
