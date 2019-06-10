#!/usr/bin/env node

import "../global";
import "./_logger";

import * as yargs from "yargs";

import {EmailNotifications, Employee, Joi, Sequelize, Unique} from "src";

const argv = yargs
  .option("email", {
    demandOption: true,
    description: "Email",
    type: "string",
  })
  .option("language", {
    demandOption: true,
    description: "Language",
    type: "string",
  })
  .option("name", {
    demandOption: true,
    description: "Name",
    type: "string",
  })
  .option("phone", {
    demandOption: true,
    description: "Phone",
    type: "string",
  })
  .epilog("The only way to create an admin").argv;

const form = Joi.validate(
  {
    email: argv.email,
    language: argv.language,
    name: argv.name,
    phone: argv.phone,
  },
  Joi.object({
    email: Joi.email().required(),
    language: Joi.pgEnumLanguageCode().required(),
    name: Joi.string().required(),
    phone: Joi.phone().required(),
  }),
);

if (form.error) {
  console.error(form.error.message);
  process.exit(1);
}

EmailNotifications.instantiateSmtp();
Sequelize.instantiate();

(async () => {
  await Unique.checkEmailAndPhone(form.value.email, form.value.phone);

  const employee = await Employee.create({
    admin: true,
    email: form.value.email,
    language: form.value.language,
    moderator: true,
    name: form.value.name,
    phone: form.value.phone,
  });

  console.log(JSON.stringify(employee.toJSON(), null, 2));

  await EmailNotifications.instance.inviteEmployee(employee);
  await Sequelize.instance.close();
  EmailNotifications.instance.close();
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
