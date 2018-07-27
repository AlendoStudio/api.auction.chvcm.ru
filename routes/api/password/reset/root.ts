import {ObjectUnit, RequestValidator, ZxcvbnUnit} from "@alendo/express-req-validator";

import {Router} from "express";

import {
  ApiCodes,
  Bcrypt,
  Const,
  EmailNotifications,
  IUserInstance,
  Sequelize,
} from "src";

const router = Router();
export default router;

/**
 * @api {post} /password/reset Сбросить пароль
 * @apiVersion 0.0.0
 * @apiName PasswordReset
 * @apiGroup SignIn
 * @apiPermission Временный пользователь
 *
 * @apiHeader (Authorization) {string} Authorization **Bearer** токен сброса пароля
 *
 * @apiParam {string} password Пароль (учитываются только первые 72 символа)
 *
 * @apiError (Bad Request 400 - Пропущен параметр) {string="OBJECT_MISSING_KEY"} code Код ошибки
 * @apiError (Bad Request 400 - Пропущен параметр) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр равен null) {string="OBJECT_NULL_VALUE"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр равен null) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр password неверный) {string="WRONG_ZXCVBN"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр password неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Unauthorized 401 - Пользователь не найден) {string="DB_USER_NOT_FOUND_BY_PASSWORD_RESET_TOKEN"} code
 * Код ошибки
 * @apiError (Unauthorized 401 - Пользователь не найден) {string} message Подробное описание ошибки
 *
 * @apiError (Unauthorized 401 - Пользователь забанен) {string="BANNED"} code Код ошибки
 * @apiError (Unauthorized 401 - Пользователь забанен) {string} message Подробное описание ошибки
 *
 * @apiUse v000CommonHeaders
 */
router.post("/", new RequestValidator({
  body: {
    Unit: ObjectUnit,
    payload: {
      password: {
        Unit: ZxcvbnUnit,
        payload: {
          minScore: Const.MINIMUM_PASSWORD_SCORE,
        },
      },
    },
  },
}).middleware, async (req, res) => {
  await res.achain
    .action(async () => {
      req.user = await Sequelize.instance.user.findOne({
        include: [{
          model: Sequelize.instance.tokensPasswordReset,
          where: {
            expires: {
              [Sequelize.op.gt]: new Date(),
            },
            token: req.token,
          },
        }],
      }) as IUserInstance;
    })
    .check(() => {
      return !!req.user;
    }, ApiCodes.DB_USER_NOT_FOUND_BY_PASSWORD_RESET_TOKEN, "user not found by password reset token", 401)
    .check(() => {
      return !!req.user && !req.user.banned;
    }, ApiCodes.BANNED, "user was banned", 401)
    .action(async () => {
      await Sequelize.instance.transaction(async () => {
        await Sequelize.instance.user.update({
          password: await Bcrypt.hash(req.body.value.password.value),
        }, {
          where: {
            id: req.user.id as string,
          },
        });
        await Sequelize.instance.tokensPasswordReset.destroy({
          where: {
            token: req.token,
          },
        });
        await EmailNotifications.instance.passwordResetComplete(req.user);
      });
    })
    .send204()
    .execute();
});
