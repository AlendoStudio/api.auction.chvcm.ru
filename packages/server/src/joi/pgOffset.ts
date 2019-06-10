import {Joi} from "celebrate";
import {Extension} from "joi";

import pgIntBase from "./pgIntBase";

export default (joi: typeof Joi): Extension => ({
  base: pgIntBase
    .pgIntBase()
    .min(0n)
    .max(9223372036854775807n)
    .default("0"),
  name: "pgOffset",
});
