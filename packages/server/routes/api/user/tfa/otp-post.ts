import {celebrate} from "celebrate";
import Router from "express-promise-router";
import * as otplib from "otplib";

import {bodyParser, Joi, TokenTfaOtp} from "src";

const router = Router();
export default router;

/**
 * @api {post} /user/tfa/otp Проверить одноразовый пароль
 * @apiVersion 1.0.0
 * @apiName CheckOTP
 * @apiGroup User
 * @apiPermission Пользователь
 *
 * @apiParam {string} token Токен
 *
 * @apiSuccess {boolean} result Пройден ли тест?
 *
 * @apiUse v100CommonErrors
 * @apiUse v100AuthViaAuthToken
 */
router.use(
  bodyParser(),
  celebrate({
    body: Joi.object({
      token: Joi.string().required(),
    }),
  }),
  async (req, res) => {
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

    res.status(200).json({
      result: otplibCheckResult,
    });
  },
);
