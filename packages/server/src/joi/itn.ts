import {Joi} from "celebrate";
import {Extension, State, ValidationOptions} from "joi";
import * as _ from "lodash";

export default (joi: typeof Joi): Extension => ({
  base: joi.any(),
  language: {
    base: "must be a number or a string",
    checksum: "must have correct checksum",
    integer: "must be 10 digits",
  },
  name: "itn",
  pre(value: unknown, state: State, options: ValidationOptions) {
    if (!_.isNumber(value) && !_.isString(value)) {
      return this.createError("itn.base", {}, state, options);
    }
    if (!/^\d{10}$/.test(String(value))) {
      return this.createError("itn.integer", {}, state, options);
    }
    const digits = String(value)
      .split("")
      .map((d) => parseInt(d, 10));
    if (
      digits[9] !==
      (digits
        .slice(0, -1)
        .map((d, index) => d * [2, 4, 10, 3, 5, 9, 4, 6, 8][index])
        .reduce((x, y) => x + y) %
        11) %
        10
    ) {
      return this.createError("itn.checksum", {}, state, options);
    }
    return String(value);
  },
});
