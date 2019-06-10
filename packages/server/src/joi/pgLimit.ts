import {Joi} from "celebrate";
import {Extension} from "joi";

import {Const} from "../const";
import pgIntBase from "./pgIntBase";

export default (joi: typeof Joi): Extension => ({
  base: pgIntBase
    .pgIntBase()
    .min(0n)
    .max(BigInt(Const.LIMIT_LIMIT))
    .default(Const.LIMIT_LIMIT),
  name: "pgLimit",
});
