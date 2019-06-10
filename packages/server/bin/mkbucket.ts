#!/usr/bin/env node

import "../global";
import "./_logger";

import * as yargs from "yargs";

import {S3} from "src";

yargs.epilog("Create S3 bucket").parse();

(async () => {
  await S3.createBucket();
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
