import * as superBodyParser from "body-parser";
import {RequestHandler} from "express";

import {Env} from "../env";

export function bodyParser(): RequestHandler {
  return superBodyParser.json({
    limit: Env.EXPRESS_BODY_LIMIT_JSON,
  });
}
