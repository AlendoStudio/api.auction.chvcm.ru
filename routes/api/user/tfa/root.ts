import {BooleanUnit, ObjectUnit, RequestValidator} from "@alendo/express-req-validator";
import {ResponseChain} from "@alendo/express-res-chain";

import {Router} from "express";

import {Sequelize} from "src";

const router = Router();
export default router;

/**
 * @api {post} /user/tfa Включить или выключить двухэтапную аутентификацию
 * @apiVersion 0.0.0
 * @apiName UpdateTFA
 * @apiGroup User
 * @apiPermission Пользователь
 *
 * @apiDescription При выключении двухэтапной аутентификации также удаляться
 * коды восстановления и секрет Google Authenticator
 *
 * @apiParam {boolean} tfa Новое состояние двухэтапной аутентификации
 *
 * @apiError (Bad Request 400 - Пропущен параметр) {string="OBJECT_MISSING_KEY"} code Код ошибки
 * @apiError (Bad Request 400 - Пропущен параметр) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр равен null) {string="OBJECT_NULL_VALUE"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр равен null) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр tfa неверный) {string="WRONG_BOOLEAN"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр tfa неверный) {string} message Подробное описание ошибки
 *
 * @apiUse v000CommonHeaders
 * @apiUse v000AuthAuth
 */
router.post("/", new RequestValidator({
  body: {
    Unit: ObjectUnit,
    payload: {
      tfa: {
        Unit: BooleanUnit,
      },
    },
  },
}).middleware, async (req, res) => {
  await res.achain
    .checkout(() => {
      return req.body.value.tfa.value === req.user.tfa ? ResponseChain.DEFAULT :
        req.body.value.tfa.value ? "enable" : "disable";
    })
    .fork("enable")
    .action(async () => {
      await Sequelize.instance.user.update({
        tfa: true,
      }, {
        where: {
          id: req.user.id as string,
        },
      });
    })
    .fork("disable")
    .action(async () => {
      await Sequelize.instance.transaction(async () => {
        await Sequelize.instance.user.update({
          authenticator: null,
          tfa: false,
        }, {
          where: {
            id: req.user.id as string,
          },
        });
        await Sequelize.instance.tokensTfaRecovery.destroy({
          where: {
            userid: req.user.id as string,
          },
        });
      });
    })
    .fork()
    .send204()
    .execute();
});
