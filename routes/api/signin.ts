import {EmailUnit, ObjectUnit, RequestValidator, ZxcvbnUnit} from "@alendo/express-req-validator";

import {Router} from "express";

import {
  ApiCodes,
  Auth,
  Bcrypt,
  Const,
  EmailNotifications,
  ITokensTfaPurgatoryInstance,
  IUserAttributes,
  Recaptcha2,
  Sequelize,
} from "src";

const router = Router();
export default router;

/**
 * @api {post} /signin Вход в систему или начало двухэтапной аутентификации
 * @apiVersion 0.0.0
 * @apiName SignIn
 * @apiGroup SignIn
 * @apiPermission Гость
 *
 * @apiParam {string} g-recaptcha-response Токен reCaptcha
 * @apiParam {string} email Email
 * @apiParam {string} password Пароль (учитываются только первые 72 символа)
 *
 * @apiSuccess (Success 200 - При включенной двухэтапной аутентификации) {string="ISO 8601"} expires
 * Дата, когда временный токен аутентификации перестанет действовать
 * @apiSuccess (Success 200 - При включенной двухэтапной аутентификации) {boolean=true} tfa
 * Включена ли двухэтапная аутентификация?
 * @apiSuccess (Success 200 - При включенной двухэтапной аутентификации) {string} token Временный токен аутентификации
 *
 * @apiError (Bad Request 400 - Пропущен параметр) {string="OBJECT_MISSING_KEY"} code Код ошибки
 * @apiError (Bad Request 400 - Пропущен параметр) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр равен null) {string="OBJECT_NULL_VALUE"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр равен null) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр email неверный) {string="WRONG_EMAIL"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр email неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр password неверный) {string="WRONG_ZXCVBN"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр password неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Unauthorized 401 - Пользователь не найден) {string="DB_USER_NOT_FOUND"} code Код ошибки
 * @apiError (Unauthorized 401 - Пользователь не найден) {string} message Подробное описание ошибки
 *
 * @apiError (Unauthorized 401 - Пользователь забанен) {string="BANNED"} code Код ошибки
 * @apiError (Unauthorized 401 - Пользователь забанен) {string} message Подробное описание ошибки
 *
 * @apiUse v000CommonHeaders
 * @apiUse v000Recaptcha2
 * @apiUse v000AuthSignUser
 */
router.post("/", Recaptcha2.instance.middleware, new RequestValidator({
  body: {
    Unit: ObjectUnit,
    payload: {
      email: {
        Unit: EmailUnit,
      },
      password: {
        Unit: ZxcvbnUnit,
        payload: {
          minScore: Const.MINIMUM_PASSWORD_SCORE,
        },
      },
    },
  },
}).middleware, async (req, res, next) => {
  let token: ITokensTfaPurgatoryInstance;
  let comparePasswordResult: boolean = false;
  const chainResult = await res.achain
    .action(async () => {
      req.user = await Sequelize.instance.user.findOne({
        where: {
          email: req.body.value.email.value,
        },
      }) as IUserAttributes;
    })
    .action(async () => {
      comparePasswordResult =
        await Bcrypt.compare(req.body.value.password.value, req.user ? req.user.password : undefined);
    })
    .check(() => {
      return !!req.user && comparePasswordResult;
    }, ApiCodes.DB_USER_NOT_FOUND, "user with same email and password not found", 401)
    .check(() => {
      return !!req.user && !req.user.banned;
    }, ApiCodes.BANNED, "user was banned", 401)
    .execute();
  if (!chainResult) {
    return;
  }
  if (req.user.tfa) {
    await res.achain
      .action(async () => {
        token = await Sequelize.instance.tokensTfaPurgatory.create({
          userid: req.user.id,
        }, {
          returning: true,
        });
      })
      .action(async () => {
        await EmailNotifications.instance.signinTfa(req.user);
      })
      .json(() => {
        return {
          expires: token.expires,
          tfa: req.user.tfa,
          token: token.token,
        };
      })
      .execute();
  } else {
    next();
  }
}, Auth.signUser());
