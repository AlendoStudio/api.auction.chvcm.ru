import {
  EmailUnit,
  ItnUnit,
  NotEmptyStringUnit,
  ObjectUnit,
  PgEnumUnit,
  PgEnumUnitCacheMemory,
  PgEnumUnitClient,
  PhoneUnit,
  PsrnUnit,
  RequestValidator,
  ZxcvbnUnit,
} from "@alendo/express-req-validator";

import {Router} from "express";

import {
  Bcrypt,
  Const,
  EmailNotifications,
  IEntityInstance,
  Jwt,
  Recaptcha2,
  Sequelize,
  Unique,
} from "src";

const router = Router();
export default router;

/**
 * @api {post} /signup Регистрация юридического лица
 * @apiVersion 0.0.0
 * @apiName SignUpEntity
 * @apiGroup SignIn
 * @apiPermission Гость
 *
 * @apiParam {string} g-recaptcha-response Токен reCaptcha
 * @apiParam {string} ceo Директор
 * @apiParam {string} email Email
 * @apiParam {number} itn Идентификационный номер налогоплательщика
 * @apiParam {string="ISO 639-1 в нижнем регистре"} language Язык
 * @apiParam {string} name Название огранизации
 * @apiParam {string} password Пароль (учитываются только первые 72 символа)
 * @apiParam {string} phone Телефон
 * @apiParam {number} psrn Основной государственный регистрационный номер
 *
 * @apiSuccess {string} token Токен аутентификации
 *
 * @apiError (Bad Request 400 - Пропущен параметр) {string="OBJECT_MISSING_KEY"} code Код ошибки
 * @apiError (Bad Request 400 - Пропущен параметр) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр равен null) {string="OBJECT_NULL_VALUE"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр равен null) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр ceo или name неверный) {string="WRONG_NOT_EMPTY_STRING"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр ceo или name неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр email неверный) {string="WRONG_EMAIL"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр email неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр itn неверный) {string="WRONG_JURIDICAL_ITN"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр itn неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр language неверный) {string="WRONG_PG_ENUM"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр language неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр password неверный) {string="WRONG_ZXCVBN"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр password неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр phone неверный) {string="WRONG_PHONE"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр phone неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр psrn неверный) {string="WRONG_JURIDICAL_PSRN"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр psrn неверный) {string} message Подробное описание ошибки
 *
 * @apiUse v000CommonHeaders
 * @apiUse v000Recaptcha2
 * @apiUse v000UniqueCheckEmailAndPhone
 * @apiUse v000UniqueCheckItnAndPsrn
 */
router.post("/", Recaptcha2.instance.middleware, new RequestValidator({
  body: {
    Unit: ObjectUnit,
    payload: {
      [ObjectUnit.FILTER]: true,
      ceo: {
        Unit: NotEmptyStringUnit,
      },
      email: {
        Unit: EmailUnit,
      },
      itn: {
        Unit: ItnUnit,
        payload: {
          juridical: true,
        },
      },
      language: {
        Unit: PgEnumUnit,
        payload: {
          cache: PgEnumUnitCacheMemory,
          client: PgEnumUnitClient,
          enumName: "LANGUAGE_CODE",
        },
      },
      name: {
        Unit: NotEmptyStringUnit,
      },
      password: {
        Unit: ZxcvbnUnit,
        payload: {
          minScore: Const.MINIMUM_PASSWORD_SCORE,
        },
      },
      phone: {
        Unit: PhoneUnit,
        payload: {
          locale: "any",
          strictMode: true,
        },
      },
      psrn: {
        Unit: PsrnUnit,
        payload: {
          juridical: true,
        },
      },
    },
  },
}).middleware, Unique.checkEmailAndPhoneMiddleware((req) => {
  return {
    email: req.body.value.email.value,
    phone: req.body.value.phone.value,
  };
}), Unique.checkItnAndPsrnMiddleware((req) => {
  return {
    itn: req.body.value.itn.value,
    psrn: req.body.value.psrn.value,
  };
}), async (req, res) => {
  let entity: IEntityInstance;
  let token: string;
  await res.achain
    .action(async () => {
      await Sequelize.instance.transaction(async () => {
        const mappedValues = (req.body as ObjectUnit).mappedValues;
        mappedValues.password = await Bcrypt.hash(mappedValues.password);
        entity = await Sequelize.instance.entity.create(mappedValues, {
          returning: true,
        });
        token = await Jwt.signUser({
          id: entity.id as string,
          type: Const.USER_TYPE_ENTITY,
        });
        await EmailNotifications.instance.signup(entity);
      });
    })
    .json(() => {
      return {
        token,
      };
    })
    .execute();
});
