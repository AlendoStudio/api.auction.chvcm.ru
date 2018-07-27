import {NotEmptyStringUnit, ObjectUnit, RequestValidator} from "@alendo/express-req-validator";

import {Router} from "express";

import {ApiCodes, Auth, Sequelize} from "src";

const router = Router();
export default router;

/**
 * @api {post} /tfa/recovery Завершить двухэтапную аутентификацию при помощи кода восстановления
 * @apiVersion 0.0.0
 * @apiName TfaRecovery
 * @apiGroup SignIn
 * @apiPermission Временный пользователь
 *
 * @apiParam {string} token Код восстановления
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
 * @apiError (Unauthorized 401 - Код восстановления не найден) {string="DB_TOKENS_TFA_RECOVERY_NOT_FOUND"} code
 * Код ошибки
 * @apiError (Unauthorized 401 - Код восстановления не найден) {string} message Подробное описание ошибки
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
      isFound = !!(await Sequelize.instance.tokensTfaRecovery.findOne({
        where: {
          token: req.body.value.token.value,
          userid: req.user.id,
        },
      }));
    })
    .check(() => {
      return isFound;
    }, ApiCodes.DB_TOKENS_TFA_RECOVERY_NOT_FOUND, "recovery code for this user not found", 401)
    .execute(next);
}, Auth.signUser(Auth.deletePurgatoryToken, Auth.deleteRecoveryToken));
