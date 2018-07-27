import {EmailUnit, ObjectUnit, RequestValidator} from "@alendo/express-req-validator";

import {Router} from "express";

import {
  ApiCodes,
  EmailNotifications,
  ITokensPasswordResetInstance,
  IUserAttributes,
  Recaptcha2,
  Sequelize,
} from "src";

const router = Router();
export default router;

/**
 * @api {post} /password/reset/email Отправить email с токеном для сброса пароля
 * @apiVersion 0.0.0
 * @apiName PasswordResetEmail
 * @apiGroup SignIn
 * @apiPermission Гость
 *
 * @apiParam {string} g-recaptcha-response Токен reCaptcha
 * @apiParam {string} email Email
 *
 * @apiSuccess {string="ISO 8601"} expires Дата, когда токен сброса пароля перестанет действовать
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
 * @apiError (Unauthorized 401 - Пользователь не найден) {string="DB_USER_NOT_FOUND_BY_EMAIL"} code Код ошибки
 * @apiError (Unauthorized 401 - Пользователь не найден) {string} message Подробное описание ошибки
 *
 * @apiError (Unauthorized 401 - Пользователь забанен) {string="BANNED"} code Код ошибки
 * @apiError (Unauthorized 401 - Пользователь забанен) {string} message Подробное описание ошибки
 *
 * @apiUse v000CommonHeaders
 */
router.post("/", Recaptcha2.instance.middleware, new RequestValidator({
  body: {
    Unit: ObjectUnit,
    payload: {
      email: {
        Unit: EmailUnit,
      },
    },
  },
}).middleware, async (req, res) => {
  let token: ITokensPasswordResetInstance;
  await res.achain
    .action(async () => {
      req.user = await Sequelize.instance.user.findOne({
        where: {
          email: req.body.value.email.value,
        },
      }) as IUserAttributes;
    })
    .check(() => {
      return !!req.user;
    }, ApiCodes.DB_USER_NOT_FOUND_BY_EMAIL, "user with same email not found", 401)
    .check(() => {
      return !!req.user && !req.user.banned;
    }, ApiCodes.BANNED, "user was banned", 401)
    .action(async () => {
      token = await Sequelize.instance.tokensPasswordReset.create({
        userid: req.user.id,
      }, {
        returning: true,
      });
    })
    .action(async () => {
      await EmailNotifications.instance.passwordReset(req.user, token.token as string);
    })
    .json(() => {
      return {
        expires: token.expires,
      };
    })
    .execute();
});
