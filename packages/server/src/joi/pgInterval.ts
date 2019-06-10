import {Joi} from "celebrate";
import {Extension, State, ValidationOptions} from "joi";
import * as postgresInterval from "postgres-interval";

export default (joi: typeof Joi): Extension => ({
  base: joi.object({
    days: joi
      .number()
      .integer()
      .positive(),
    hours: joi
      .number()
      .integer()
      .positive(),
    milliseconds: joi
      .number()
      .integer()
      .positive(),
    minutes: joi
      .number()
      .integer()
      .positive(),
    months: joi
      .number()
      .integer()
      .positive(),
    seconds: joi
      .number()
      .integer()
      .positive(),
    years: joi
      .number()
      .integer()
      .positive(),
  }),
  name: "pgInterval",
  pre(value: unknown, state: State, options: ValidationOptions) {
    return Object.assign(postgresInterval(""), value).toPostgres();
  },
});
