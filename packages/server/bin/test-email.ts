#!/usr/bin/env node

import "../global";
import "./_logger";

import * as yargs from "yargs";

import {EmailNotifications, Joi} from "src";

const argv = yargs
  .option("to", {
    demandOption: true,
    description: "Recipient",
    type: "string",
  })
  .option("locale", {
    default: "en",
    description: "Email language",
    type: "string",
  })
  .epilog("Send test email").argv;

const form = Joi.validate(
  {
    locale: argv.locale,
    to: argv.to,
  },
  Joi.object({
    locale: Joi.pgEnumLanguageCode().required(),
    to: Joi.email().required(),
  }),
);

if (form.error) {
  console.error(form.error.message);
  process.exit(1);
}

EmailNotifications.instantiateSmtp();

(async () => {
  await EmailNotifications.instance.test(form.value.to, form.value.locale);
  EmailNotifications.instance.close();
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
