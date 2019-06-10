import {celebrate} from "celebrate";
import Router from "express-promise-router";
import * as otplib from "otplib";

import {bodyParser, Const, Joi, TokenTfaOtp} from "src";

const router = Router();
export default router;

/**
 * @api {put} /user/tfa/otp Сгенерировать новый секрет одноразового пароля
 * @apiVersion 1.0.0
 * @apiName GenerateOTP
 * @apiGroup User
 * @apiPermission Пользователь
 *
 * @apiParam {string="authenticator"} [type='"authenticator"'] Тип однаразового пароля
 *
 * @apiSuccess (Success 200 - authenticator) {string} keyuri URL для генерации QR кода
 * @apiSuccess (Success 200 - authenticator) {string} secret Секрет одноразового пароля
 *
 * @apiUse v100CommonErrors
 * @apiUse v100AuthViaAuthToken
 */
router.use(
  bodyParser(),
  celebrate({
    body: Joi.object({
      type: Joi.string()
        .valid("authenticator")
        .default("authenticator"),
    }),
  }),
  async (req, res) => {
    switch (req.body.type) {
      case "authenticator": {
        const secret = otplib.authenticator.generateSecret();
        const keyuri = otplib.authenticator.keyuri(
          req.user.name as string,
          Const.AUTHENTICATOR_SERVICE,
          secret,
        );

        await TokenTfaOtp.upsert({
          token: secret,
          type: req.body.type,
          userId: req.user.id,
        });

        res.status(200).json({
          keyuri,
          secret,
        });
        break;
      }
    }
  },
);
