#!/usr/bin/env node

import "../global";

import {EmailUnit, ObjectUnit} from "@alendo/express-req-validator";

import * as commander from "commander";

import {EmailNotifications, RedisClient} from "src";

const program = commander
  .description("send test email")
  .option("--to [value]", "to")
  .parse(process.argv);

RedisClient.instantiate();
EmailNotifications.instantiateSmtp();

const form = new ObjectUnit(program, {
  to: {
    Unit: EmailUnit,
  },
});

// tslint:disable no-console
(async () => {
  await form.execute();
  if (!form.valid) {
    console.error(form.code);
    console.error(form.message);
    process.exit(1);
  } else {
    await EmailNotifications.instance.test(form.value.to.value);
    await RedisClient.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
