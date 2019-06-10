import {Joi} from "celebrate";
import {Extension, State, ValidationOptions} from "joi";
import * as validator from "validator";

export default (joi: typeof Joi): Extension => ({
  base: joi.string(),
  language: {
    email: "must be a valid email",
  },
  name: "email",
  pre(value: string, state: State, options: ValidationOptions) {
    if (validator.isEmail(value)) {
      return validator.normalizeEmail(value);
    } else {
      return this.createError("email.email", {}, state, options);
    }
  },
});
