import {Joi} from "celebrate";
import {AnySchema, ExtensionBoundSchema, State, ValidationOptions} from "joi";
import * as _ from "lodash";

type IPgIntBaseThis = ExtensionBoundSchema & {
  _valueAsBigInt: bigint;
};

interface IPgIntBaseSchema extends AnySchema {
  max(limit: bigint): this;

  min(limit: bigint): this;
}

export default Joi.extend({
  language: {
    base: "must be a number or a string",
    integer: "must be an integer",
    max: "must be less than or equal to {{limit}}",
    min: "must be larger than or equal to {{limit}}",
  },
  name: "pgIntBase",
  pre(value: unknown, state: State, options: ValidationOptions) {
    if (!_.isNumber(value) && !_.isString(value)) {
      return this.createError("pgIntBase.base", {}, state, options);
    }
    if (!/^-?\d+$/.test(String(value))) {
      return this.createError("pgIntBase.integer", {}, state, options);
    }
    (this as IPgIntBaseThis)._valueAsBigInt = BigInt(value);
    return String(value);
  },
  rules: [
    {
      name: "max",
      params: {
        limit: Joi.any(),
      },
      validate(
        params: {limit: bigint},
        value: unknown,
        state: State,
        options: ValidationOptions,
      ) {
        if ((this as IPgIntBaseThis)._valueAsBigInt > params.limit) {
          return this.createError(
            "pgIntBase.max",
            {limit: params.limit.toString()},
            state,
            options,
          );
        }
        return value;
      },
    },
    {
      name: "min",
      params: {
        limit: Joi.any(),
      },
      validate(
        params: {limit: bigint},
        value: unknown,
        state: State,
        options: ValidationOptions,
      ) {
        if ((this as IPgIntBaseThis)._valueAsBigInt < params.limit) {
          return this.createError(
            "pgIntBase.min",
            {limit: params.limit.toString()},
            state,
            options,
          );
        }
        return value;
      },
    },
  ],
}) as typeof Joi & {
  pgIntBase: () => IPgIntBaseSchema;
};
