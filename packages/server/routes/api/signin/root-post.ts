import {celebrate} from "celebrate";
import Router from "express-promise-router";
import * as assert from "http-assert";

import {
  ApiCodes,
  Bcrypt,
  bodyParser,
  EmailNotifications,
  IUserAttributes,
  Joi,
  Jwt,
  reCaptcha2,
  TokenTfaPurgatory,
  User,
} from "src";

const router = Router();
export default router;

/**
 * @api {post} /signin Вход в систему или начать двухэтапную аутентификацию
 * @apiVersion 1.0.0
 * @apiName SignIn
 * @apiGroup SignIn
 * @apiPermission Гость
 *
 * @apiParam {string} g-recaptcha-response Токен reCaptcha v2
 * @apiParam {string} email Email
 * @apiParam {string} password Пароль (учитываются только первые 72 символа)
 *
 * @apiSuccess (Success 200 - При включенной двухэтапной аутентификации) {string="ISO 8601"} expires Дата, когда временный токен аутентификации перестанет действовать
 * @apiSuccess (Success 200 - При включенной двухэтапной аутентификации) {boolean=true} tfa Включена ли двухэтапная аутентификация?
 * @apiSuccess (Success 200 - При включенной двухэтапной аутентификации) {string} token Временный токен авторизации
 *
 * @apiSuccess (Success 200 - При выключенной двухэтапной аутентификации) {boolean=false} tfa Включена ли двухэтапная аутентификация?
 * @apiSuccess (Success 200 - При выключенной двухэтапной аутентификации) {string} token Токен авторизации
 *
 * @apiError (Unauthorized 401 - Пользователь не найден) {string="USER_NOT_FOUND_BY_EMAIL_AND_PASSWORD"} code Код ошибки
 * @apiError (Unauthorized 401 - Пользователь не найден) {string} message Подробное описание ошибки
 *
 * @apiError (Unauthorized 401 - Пользователь забанен) {string="BANNED"} code Код ошибки
 * @apiError (Unauthorized 401 - Пользователь забанен) {string} message Подробное описание ошибки
 *
 * @apiUse v100CommonErrors
 * @apiUse v100Recaptcha2
 */
router.use(
  bodyParser(),
  reCaptcha2,
  celebrate({
    body: Joi.object({
      email: Joi.email().required(),
      password: Joi.zxcvbn().required(),
    }).append({
      "g-recaptcha-response": Joi.any().strip(),
    }),
  }),
  async (req, res) => {
    req.user = (await User.findOne({
      attributes: [
        "banned",
        "email",
        "id",
        "language",
        "name",
        "password",
        "tfa",
        "type",
      ],
      where: {
        email: req.body.email,
      },
    })) as IUserAttributes;
    assert(
      req.user && (await Bcrypt.compare(req.body.password, req.user.password)),
      401,
      "user with same email and password not found",
      {code: ApiCodes.USER_NOT_FOUND_BY_EMAIL_AND_PASSWORD},
    );
    assert(!req.user.banned, 401, "user was banned", {code: ApiCodes.BANNED});

    if (req.user.tfa) {
      const token = await TokenTfaPurgatory.create({
        userId: req.user.id,
      });

      res.status(200).json({
        expires: token.expires,
        tfa: req.user.tfa,
        token: token.token,
      });

      await EmailNotifications.instance.signinTfa(req.user);
    } else {
      res.status(200).json({
        tfa: req.user.tfa,
        token: await Jwt.signUser({
          id: req.user.id as string,
          type: req.user.type as string,
        }),
      });

      await EmailNotifications.instance.signin(req.user);
    }
  },
);
