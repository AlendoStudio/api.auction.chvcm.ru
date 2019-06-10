import {Joi} from "celebrate";
import {Extension, State, ValidationOptions} from "joi";
import * as _ from "lodash";

export default (joi: typeof Joi): Extension => ({
  base: joi.any(),
  language: {
    base: "must be a number or a string",
    checksum: "must have correct checksum",
    integer: "must be 13 digits",
  },
  name: "psrn",
  pre(value: unknown, state: State, options: ValidationOptions) {
    if (!_.isNumber(value) && !_.isString(value)) {
      return this.createError("psrn.base", {}, state, options);
    }
    if (!/^\d{13}$/.test(String(value))) {
      return this.createError("psrn.integer", {}, state, options);
    }
    if (
      parseInt(String(value).slice(-1), 10) !==
      (parseInt(String(value).slice(0, -1), 10) % 11) % 10
    ) {
      return this.createError("psrn.checksum", {}, state, options);
    }
    return String(value);
  },
});
