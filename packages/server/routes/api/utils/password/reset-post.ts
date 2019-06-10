import {celebrate} from "celebrate";
import * as bearerToken from "express-bearer-token";
import Router from "express-promise-router";
import * as assert from "http-assert";
import {Op} from "sequelize";

import {
  ApiCodes,
  Bcrypt,
  bodyParser,
  EmailNotifications,
  Joi,
  Sequelize,
  TokenPasswordReset,
  User,
} from "src";

const router = Router();
export default router;

/**
 * @api {post} /utils/password/reset Сбросить пароль
 * @apiVersion 1.0.0
 * @apiName ResetPassword
 * @apiGroup Utils
 * @apiPermission Временный пользователь
 *
 * @apiHeader (Authorization) {string} Authorization **Bearer** токен сброса пароля
 *
 * @apiParam {string} password Пароль (учитываются только первые 72 символа)
 *
 * @apiError (Unauthorized 401 - Пользователь не найден) {string="USER_NOT_FOUND_BY_PASSWORD_RESET_TOKEN"} code Код ошибки
 * @apiError (Unauthorized 401 - Пользователь не найден) {string} message Подробное описание ошибки
 *
 * @apiError (Unauthorized 401 - Пользователь забанен) {string="BANNED"} code Код ошибки
 * @apiError (Unauthorized 401 - Пользователь забанен) {string} message Подробное описание ошибки
 *
 * @apiUse v100CommonErrors
 */
router.use(
  bearerToken(),
  async (req, res) => {
    req.user = (req.token
      ? await User.findOne({
          attributes: ["banned", "email", "id", "language", "name"],
          include: [
            {
              model: TokenPasswordReset,
              where: {
                expires: {
                  [Op.gt]: new Date(),
                },
                token: req.token,
              },
            },
          ],
        })
      : null) as User;
    assert(req.user, 401, "user not found by password reset token", {
      code: ApiCodes.USER_NOT_FOUND_BY_PASSWORD_RESET_TOKEN,
    });
    assert(!req.user.banned, 401, "user was banned", {code: ApiCodes.BANNED});

    return "next";
  },
  bodyParser(),
  celebrate({
    body: Joi.object({
      password: Joi.zxcvbn().required(),
    }),
  }),
  async (req, res) => {
    await Sequelize.instance.transaction(async () => {
      await User.update(
        {
          password: await Bcrypt.hash(req.body.password),
        },
        {
          where: {
            id: req.user.id as string,
          },
        },
      );
      await TokenPasswordReset.destroy({
        where: {
          userId: req.user.id as string,
        },
      });
    });

    res.status(204).send();

    await EmailNotifications.instance.passwordResetComplete(req.user);
  },
);
