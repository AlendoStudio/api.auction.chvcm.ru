import {Joi} from "celebrate";
import {Extension} from "joi";

export default (joi: typeof Joi): Extension => ({
  base: joi
    .string()
    .empty()
    .regex(/^[a-zA-Zа-яА-Я0-9_\-]([a-zA-Zа-яА-Я0-9_\- ]*(\.\w+)?)*\.\w+$/),
  name: "attachmentName",
});
