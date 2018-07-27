import {NotEmptyStringUnit, ObjectUnit, RequestValidator} from "@alendo/express-req-validator";

import {Router} from "express";

import {
  ApiCodes,
  Auth,
  EmailNotifications,
  ITokensTfaEmailInstance,
  Sequelize,
} from "src";

const router = Router();
export default router;

/**
 * @api {get} /tfa/email Отправить email с токеном для завершения двухэтапной аутентификации
 * @apiVersion 0.0.0
 * @apiName TfaEmailSend
 * @apiGroup SignIn
 * @apiPermission Временный пользователь
 *
 * @apiUse v000CommonHeaders
 * @apiUse v000AuthPurgatory
 */
router.get("/", async (req, res) => {
  let token: ITokensTfaEmailInstance;
  await res.achain
    .action(async () => {
      token = await Sequelize.instance.tokensTfaEmail.create({
        purgatory: req.token,
      }, {
        returning: true,
      });
    })
    .action(async () => {
      await EmailNotifications.instance.tfaEmail(req.user, token.token as string);
    })
    .send204()
    .execute();
});

/**
 * @api {post} /tfa/email Завершить двухэтапную аутентификацию при помощи токена полученного по email
 * @apiVersion 0.0.0
 * @apiName TfaEmail
 * @apiGroup SignIn
 * @apiPermission Временный пользователь
 *
 * @apiParam {string} token Токен полученный по email
 *
 * @apiError (Bad Request 400 - Пропущен параметр) {string="OBJECT_MISSING_KEY"} code Код ошибки
 * @apiError (Bad Request 400 - Пропущен параметр) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр равен null) {string="OBJECT_NULL_VALUE"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр равен null) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр token неверный) {string="WRONG_NOT_EMPTY_STRING"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр token неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Unauthorized 401 - Токен не найден) {string="DB_TOKENS_TFA_EMAIL_NOT_FOUND"} code Код ошибки
 * @apiError (Unauthorized 401 - Токен не найден) {string} message Подробное описание ошибки
 *
 * @apiUse v000CommonHeaders
 * @apiUse v000AuthPurgatory
 * @apiUse v000AuthSignUser
 */
router.post("/", new RequestValidator({
  body: {
    Unit: ObjectUnit,
    payload: {
      token: {
        Unit: NotEmptyStringUnit,
      },
    },
  },
}).middleware, async (req, res, next) => {
  let isFound: boolean;
  await res.achain
    .action(async () => {
      isFound = !!(await Sequelize.instance.tokensTfaEmail.findOne({
        where: {
          purgatory: req.token,
          token: req.body.value.token.value,
        },
      }));
    })
    .check(() => {
      return isFound;
    }, ApiCodes.DB_TOKENS_TFA_EMAIL_NOT_FOUND, "email token for this user not found", 401)
    .execute(next);
}, Auth.signUser(Auth.deletePurgatoryToken));
