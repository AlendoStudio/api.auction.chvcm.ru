import {Joi} from "celebrate";
import {Extension, State, ValidationOptions} from "joi";
import * as _ from "lodash";

export default (joi: typeof Joi): Extension => ({
  language: {
    base: "must be a number or a string",
    digits:
      "must up to 131072 digits before the decimal point; up to 16383 digits after the decimal point",
    positive: "must be a positive",
  },
  name: "pgNumeric",
  pre(value: unknown, state: State, options: ValidationOptions) {
    if (!_.isNumber(value) && !_.isString(value)) {
      return this.createError("pgNumeric.base", {}, state, options);
    }
    if (!/^-?\d{1,131072}(\.\d{1,16383})?$/.test(String(value))) {
      return this.createError("pgNumeric.digits", {}, state, options);
    }
    return String(value);
  },
  rules: [
    {
      name: "positive",
      validate(
        params: unknown,
        value: string,
        state: State,
        options: ValidationOptions,
      ) {
        if (value.startsWith("-")) {
          return this.createError("pgNumeric.positive", {}, state, options);
        }
        return value;
      },
    },
  ],
});
