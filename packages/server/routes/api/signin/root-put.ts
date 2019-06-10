import {celebrate} from "celebrate";
import Router from "express-promise-router";
import * as assert from "http-assert";
import * as otplib from "otplib";

import {
  ApiCodes,
  authViaPurgatoryToken,
  bodyParser,
  EmailNotifications,
  Joi,
  Jwt,
  TokenTfaOtp,
  TokenTfaPurgatory,
  TokenTfaRecovery,
} from "src";

const router = Router();
export default router;

/**
 * @api {put} /signin Завершить двухэтапную аутентификацию
 * @apiVersion 1.0.0
 * @apiName SignInWithTFA
 * @apiGroup SignIn
 * @apiPermission Временный пользователь
 *
 * @apiParam {string} token Токен
 * @apiParam {string="otp","recovery"} type Тип токена
 *
 * @apiSuccess {boolean} tfa Включена ли двухэтапная аутентификация?
 * @apiSuccess {string} token Токен авторизации
 *
 * @apiError (Unauthorized 401 - Токен не прошел проверку) {string="WRONG_OTP_TOKEN"} code Код ошибки
 * @apiError (Unauthorized 401 - Токен не прошел проверку) {string} message Подробное описание ошибки
 *
 * @apiError (Unauthorized 401 - Код восстановления не найден) {string="RECOVERY_CODE_NOT_FOUND"} code Код ошибки
 * @apiError (Unauthorized 401 - Код восстановления не найден) {string} message Подробное описание ошибки
 *
 * @apiUse v100CommonErrors
 * @apiUse v100AuthViaPurgatoryToken
 */
router.use(
  authViaPurgatoryToken,
  bodyParser(),
  celebrate({
    body: Joi.object({
      token: Joi.string().required(),
      type: Joi.string()
        .valid("otp", "recovery")
        .required(),
    }),
  }),
  async (req, res) => {
    switch (req.body.type) {
      case "otp": {
        const tokenTfaOtp = await TokenTfaOtp.findByPk(req.user.id, {
          attributes: ["token", "type"],
        });

        let otplibCheckResult = false;
        if (tokenTfaOtp) {
          switch (tokenTfaOtp.type) {
            case "authenticator": {
              otplibCheckResult = otplib.authenticator.check(
                req.body.token,
                tokenTfaOtp.token as string,
              );
              break;
            }
          }
        }
        assert(otplibCheckResult, 401, "wrong otp token", {
          code: ApiCodes.WRONG_OTP_TOKEN,
        });
        break;
      }
      case "recovery": {
        assert(
          await TokenTfaRecovery.destroy({
            where: {token: req.body.token},
          }),
          401,
          "recovery code not found",
          {code: ApiCodes.RECOVERY_CODE_NOT_FOUND},
        );
        break;
      }
    }

    await TokenTfaPurgatory.destroy({
      where: {
        token: req.token as string,
      },
    });

    res.status(200).json({
      tfa: req.user.tfa,
      token: await Jwt.signUser({
        id: req.user.id as string,
        type: req.user.type as string,
      }),
    });

    await EmailNotifications.instance.signin(req.user);
  },
);
