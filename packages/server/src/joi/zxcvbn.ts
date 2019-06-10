import {Joi} from "celebrate";
import {Extension, State, ValidationOptions} from "joi";
import * as zxcvbn from "zxcvbn";

import {Const} from "../const";

export default (joi: typeof Joi): Extension => ({
  base: joi.string(),
  language: {
    length: "length must be less than or equal to {{limit}} characters long",
    score: "score must be larger than or equal to {{limit}}",
  },
  name: "zxcvbn",
  pre(value: string, state: State, options: ValidationOptions) {
    if (value.length > 72) {
      return this.createError("zxcvbn.length", {limit: 72}, state, options);
    }
    if (zxcvbn(value).score < Const.MINIMUM_PASSWORD_SCORE) {
      return this.createError(
        "zxcvbn.score",
        {limit: Const.MINIMUM_PASSWORD_SCORE},
        state,
        options,
      );
    }
    return value;
  },
});
