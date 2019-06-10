#!/usr/bin/env node

import "../global";
import "./_logger";

import * as yargs from "yargs";

import {debug, EmailNotifications, Sequelize, Web} from "src";

yargs.epilog("Instantiate Web instance and start listening").parse();

EmailNotifications.instantiateSmtp();
Sequelize.instantiate();
Web.instantiate();

debug("Welcome to api.auction.chvcm.ru!");
Web.instance.listen().then((address) => {
  debug(`Web listening on %o`, address);
});

async function handle(signal: string): Promise<void> {
  await Web.instance.close();
  await Sequelize.instance.close();
  EmailNotifications.instance.close();
  debug(`Web was stopped by ${signal} signal`);
}

process.on("SIGINT", handle);
process.on("SIGTERM", handle);
