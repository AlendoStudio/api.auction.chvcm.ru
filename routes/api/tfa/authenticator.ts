import {NotEmptyStringUnit, ObjectUnit, RequestValidator} from "@alendo/express-req-validator";
import {Router} from "express";
import * as otplib from "otplib";

import {ApiCodes, Auth} from "src";

const router = Router();
export default router;

/**
 * @api {post} /tfa/authenticator Завершить двухэтапную аутентификацию при помощи Google Authenticator
 * @apiVersion 0.0.0
 * @apiName TfaAuthenticator
 * @apiGroup SignIn
 * @apiPermission Временный пользователь
 *
 * @apiParam {string} token Токен сгенерированный при помощи Google Authenticator
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
 * @apiError (Unauthorized 401 - Токен не прошел проверку) {string="AUTHENTICATOR_WRONG_TOKEN"} code Код ошибки
 * @apiError (Unauthorized 401 - Токен не прошел проверку) {string} message Подробное описание ошибки
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
  let optlibCheckResult: boolean;
  await res.achain
    .action(() => {
      optlibCheckResult = otplib.authenticator.check(req.body.value.token.value, req.user.authenticator as string);
    })
    .check(() => {
      return optlibCheckResult;
    }, ApiCodes.AUTHENTICATOR_WRONG_TOKEN, "wrong authenticator token", 401)
    .execute(next);
}, Auth.signUser(Auth.deletePurgatoryToken));
