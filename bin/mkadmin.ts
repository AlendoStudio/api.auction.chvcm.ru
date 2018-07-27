#!/usr/bin/env node

import "../global";

import {
  EmailUnit,
  NotEmptyStringUnit,
  ObjectUnit,
  PgEnumUnit,
  PgEnumUnitCacheMemory,
  PgEnumUnitClient,
  PhoneUnit,
} from "@alendo/express-req-validator";

import * as commander from "commander";

import {EmailNotifications, RedisClient, Sequelize, Unique} from "src";

const program = commander
  .description("make admin")
  .option("--name [value]", "name")
  .option("--email [value]", "email")
  .option("--phone [value]", "phone")
  .option("--language [value]", "language")
  .parse(process.argv);

RedisClient.instantiate();
EmailNotifications.instantiateSmtp();
Sequelize.instantiateWorker();
PgEnumUnitClient.instantiate(Sequelize.instance);
PgEnumUnitCacheMemory.instantiate();

const form = new ObjectUnit(program, {
  email: {
    Unit: EmailUnit,
  },
  language: {
    Unit: PgEnumUnit,
    payload: {
      cache: PgEnumUnitCacheMemory,
      client: PgEnumUnitClient,
      enumName: "LANGUAGE_CODE",
    },
  },
  name: {
    Unit: NotEmptyStringUnit,
  },
  phone: {
    Unit: PhoneUnit,
    payload: {
      locale: "any",
      strictMode: true,
    },
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
    const checkResult = await Unique.checkEmailAndPhone(form.value.email.value, form.value.phone.value);
    if (checkResult.email || checkResult.phone) {
      if (checkResult.email && checkResult.phone) {
        console.error("user with same email and phone already exists");
      } else if (checkResult.email) {
        console.error("user with same email already exists");
      } else if (checkResult.phone) {
        console.error("user with same phone already exists");
      }
      process.exit(1);
    } else {
      const employee = await Sequelize.instance.employee.create({
        admin: true,
        email: form.value.email.value,
        language: form.value.language.value,
        moderator: true,
        name: form.value.name.value,
        phone: form.value.phone.value,
      }, {
        returning: true,
      });
      const json = employee.toJSON() as any;
      for (const key in json) {
        if (json.hasOwnProperty(key)) {
          console.log(`${key}: ${json[key]}`);
        }
      }
      await EmailNotifications.instance.inviteEmployee(employee);
      await Sequelize.instance.close();
      await RedisClient.close();
    }
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
