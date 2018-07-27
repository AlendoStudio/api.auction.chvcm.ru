// tslint:disable no-reference
/// <reference path="./types/index.d.ts" />

import * as fs from "fs";
import * as path from "path";

import * as appModulePath from "app-module-path";
import * as dotenv from "dotenv";

appModulePath.addPath(__dirname);

let baseDir: string;

if (fs.existsSync(path.resolve(__dirname, "package.json"))) {
  baseDir = __dirname;
} else if (fs.existsSync(path.resolve(__dirname, "..", "package.json"))) {
  baseDir = path.resolve(__dirname, "..");
} else {
  throw new Error("Can't detect base directory with package.json!");
}

dotenv.config({
  path: path.join(baseDir, ".env"),
});

/**
 * Global
 */
export class Global {
  /**
   * Base directory with package.json
   * @type {string}
   */
  public static readonly baseDir: string = baseDir;
}
