import {Joi} from "celebrate";
import {Extension, State, ValidationOptions} from "joi";
import * as validator from "validator";

export default (joi: typeof Joi): Extension => ({
  base: joi.string(),
  language: {
    ruRu: "must be in format +79xxxxxxxxx",
  },
  name: "phone",
  pre(value: unknown, state: State, options: ValidationOptions) {
    if (
      !validator.isMobilePhone(value as string, "ru-RU", {strictMode: true})
    ) {
      return this.createError("phone.ruRu", {}, state, options);
    }
    return value;
  },
});
