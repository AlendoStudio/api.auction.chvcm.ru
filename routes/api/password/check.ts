import {ObjectUnit, RequestValidator, StringUnit} from "@alendo/express-req-validator";

import {Router} from "express";
import * as zxcvbn from "zxcvbn";

import {Const} from "src";

const router = Router();
export default router;

/**
 * @api {post} /password/check Проверить пароль
 * @apiVersion 0.0.0
 * @apiName PasswordCheck
 * @apiGroup Utils
 * @apiPermission Гость
 *
 * @apiParam {string} password Пароль (учитываются только первые 72 символа)
 *
 * @apiSuccess {object} score Рейтинг пароля
 * @apiSuccess {number=0,1,2,3,4} score.actual Текущий рейтинг пароля
 * @apiSuccess {number=1,3} score.expected Минимально резрешенный рейтинг пароля
 * @apiSuccess {number=4} score.max Максимальный рейтинг пароля
 * @apiSuccess {number=0} score.min Минимальный рейтинг пароля
 *
 * @apiError (Bad Request 400 - Пропущен параметр) {string="OBJECT_MISSING_KEY"} code Код ошибки
 * @apiError (Bad Request 400 - Пропущен параметр) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр равен null) {string="OBJECT_NULL_VALUE"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр равен null) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр password не строка) {string="WRONG_STRING"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр password не строка) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр password не той длины) {string="WRONG_STRING_LENGTH_RANGE"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр password не той длины) {string} message Подробное описание ошибки
 *
 * @apiUse v000CommonHeaders
 */
router.post("/", new RequestValidator({
  body: {
    Unit: ObjectUnit,
    payload: {
      password: {
        Unit: StringUnit,
        payload: {
          maxLength: 72,
          minLength: 1,
        },
      },
    },
  },
}).middleware, async (req, res) => {
  await res.achain
    .json(() => {
      return {
        score: {
          actual: zxcvbn(req.body.value.password.value).score,
          expected: Const.MINIMUM_PASSWORD_SCORE,
          max: 4,
          min: 0,
        },
      };
    })
    .execute();
});
