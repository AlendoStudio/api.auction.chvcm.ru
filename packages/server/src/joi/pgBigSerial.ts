import {Joi} from "celebrate";
import {Extension} from "joi";

import pgIntBase from "./pgIntBase";

export default (joi: typeof Joi): Extension => ({
  base: pgIntBase
    .pgIntBase()
    .min(1n)
    .max(9223372036854775807n),
  name: "pgBigSerial",
});
