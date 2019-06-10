import {celebrate} from "celebrate";
import Router from "express-promise-router";
import * as assert from "http-assert";

import {
  ApiCodes,
  EmailNotifications,
  Joi,
  reCaptcha2,
  TokenPasswordReset,
  User,
} from "src";

const router = Router();
export default router;

/**
 * @api {get} /utils/password/reset Отправить на указанный email токен для сброса пароля
 * @apiVersion 1.0.0
 * @apiName SendPasswordResetEmail
 * @apiGroup Utils
 * @apiPermission Гость
 *
 * @apiParam {string} g-recaptcha-response Токен reCaptcha v2
 * @apiParam {string} email Email
 *
 * @apiSuccess {string="ISO 8601"} expires Дата, когда токен сброса пароля перестанет действовать
 *
 * @apiError (Unauthorized 401 - Пользователь не найден) {string="USER_NOT_FOUND_BY_EMAIL"} code Код ошибки
 * @apiError (Unauthorized 401 - Пользователь не найден) {string} message Подробное описание ошибки
 *
 * @apiError (Unauthorized 401 - Пользователь забанен) {string="BANNED"} code Код ошибки
 * @apiError (Unauthorized 401 - Пользователь забанен) {string} message Подробное описание ошибки
 *
 * @apiUse v100CommonErrors
 * @apiUse v100Recaptcha2
 */
router.use(
  reCaptcha2,
  celebrate({
    query: Joi.object({
      email: Joi.email().required(),
    }).append({
      "g-recaptcha-response": Joi.any().strip(),
    }),
  }),
  async (req, res) => {
    req.user = (await User.findOne({
      attributes: ["banned", "email", "id", "language", "name"],
      where: {
        email: req.query.email,
      },
    })) as User;
    assert(req.user, 401, "user with same email not found", {
      code: ApiCodes.USER_NOT_FOUND_BY_EMAIL,
    });
    assert(!req.user.banned, 401, "user was banned", {code: ApiCodes.BANNED});

    const token = await TokenPasswordReset.create({
      userId: req.user.id,
    });

    res.status(200).json({
      expires: token.expires,
    });

    await EmailNotifications.instance.passwordReset(
      req.user,
      token.token as string,
    );
  },
);
