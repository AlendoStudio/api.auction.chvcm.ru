import {Joi} from "celebrate";
import {Extension} from "joi";

export default (joi: typeof Joi): Extension => ({
  base: joi.string().valid("kg", "piece"),
  name: "pgEnumAmountType",
});
