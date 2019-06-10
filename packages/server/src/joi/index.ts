import {Joi as SuperJoi} from "celebrate";
import {AnySchema, ObjectSchema, StringSchema} from "joi";

import attachmentName from "./attachmentName";
import email from "./email";
import itn from "./itn";
import pgBigSerial from "./pgBigSerial";
import pgEnumAmountType from "./pgEnumAmountType";
import pgEnumCurrency from "./pgEnumCurrency";
import pgEnumLanguageCode from "./pgEnumLanguageCode";
import pgInterval from "./pgInterval";
import pgLimit from "./pgLimit";
import pgNumeric from "./pgNumeric";
import pgOffset from "./pgOffset";
import phone from "./phone";
import psrn from "./psrn";
import zxcvbn from "./zxcvbn";

interface IPgNumericSchema extends AnySchema {
  positive(): this;
}

export const Joi = SuperJoi.extend(
  attachmentName,
  email,
  itn,
  pgBigSerial,
  pgEnumAmountType,
  pgEnumCurrency,
  pgEnumLanguageCode,
  pgInterval,
  pgLimit,
  pgNumeric,
  pgOffset,
  phone,
  psrn,
  zxcvbn,
) as typeof SuperJoi & {
  attachmentName: () => StringSchema;
  email: () => StringSchema;
  itn: () => AnySchema;
  pgBigSerial: () => AnySchema;
  pgEnumAmountType: () => StringSchema;
  pgEnumCurrency: () => StringSchema;
  pgEnumLanguageCode: () => StringSchema;
  pgInterval: () => ObjectSchema;
  pgLimit: () => AnySchema;
  pgNumeric: () => IPgNumericSchema;
  pgOffset: () => AnySchema;
  phone: () => StringSchema;
  psrn: () => AnySchema;
  zxcvbn: () => StringSchema;
};
