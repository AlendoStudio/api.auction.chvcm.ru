import {ObjectUnit, PgBigSerialUnit, PgNumericUnit, RequestValidator} from "@alendo/express-req-validator";

import {Router} from "express";

import {ApiCodes, Auth, ILotInstance, Sequelize} from "src";

const router = Router();
export default router;

router.use(Auth.requireVerifiedEntity);

/**
 * @api {post} /lot/bet/:id Сделать ставку
 * @apiVersion 0.0.0
 * @apiName Bet
 * @apiGroup Lot
 * @apiPermission Проверенное юридическое лицо
 *
 * @apiParam {string="1..9223372036854775807"} :id ID лота
 * @apiParam {string="до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки"} bid
 * Новая ставка >= 0
 *
 * @apiSuccess {string="ISO 8601"} finish Время окончания аукциона
 * @apiSuccess {string="0..9223372036854775807"} participants Число участников
 * @apiSuccess {string="до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки"} [winbid]
 * Ставка победителя
 * @apiSuccess {string="1..9223372036854775807"} [winner] ID победителя
 *
 * @apiError (Bad Request 400 - Пропущен параметр) {string="OBJECT_MISSING_KEY"} code Код ошибки
 * @apiError (Bad Request 400 - Пропущен параметр) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр равен null) {string="OBJECT_NULL_VALUE"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр равен null) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр :id неверный) {string="WRONG_PG_BIGSERIAL"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр :id неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр bid неверный) {string="WRONG_PG_NUMERIC"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр bid неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Лот не существует или не активен) {string="DB_LOT_NOT_FOUND"} code Код ошибки
 * @apiError (Bad Request 400 - Лот не существует или не активен) {string} message Подробное описание ошибки
 *
 * @apiUse v000CommonHeaders
 * @apiUse v000AuthAuth
 * @apiUse v000AuthRequireVerifiedEntity
 */
router.post("/:id", new RequestValidator({
  body: {
    Unit: ObjectUnit,
    payload: {
      bid: {
        Unit: PgNumericUnit,
        payload: {
          disallowNegative: true,
        },
      },
    },
  },
  params: {
    Unit: ObjectUnit,
    payload: {
      id: {
        Unit: PgBigSerialUnit,
      },
    },
  },
}).middleware, async (req, res) => {
  let lots: [number, ILotInstance[]];
  await res.achain
    .action(async () => {
      lots = await Sequelize.instance.lot.update({
        winbid: req.body.value.bid.value,
        winner: req.entity.id,
      }, {
        returning: true,
        where: {
          finish: {
            [Sequelize.op.gt]: new Date(),
          },
          id: req.params.value.id.value,
          start: {
            [Sequelize.op.lt]: new Date(),
          },
        },
      });
    })
    .check(() => {
      return lots[0] !== 0;
    }, ApiCodes.DB_LOT_NOT_FOUND, "lot with same id not found or not active", 400)
    // TODO: обновить таймер на финиш
    .json(() => {
      return {
        finish: lots[1][0].finish,
        participants: lots[1][0].participants,
        winbid: lots[1][0].winbid || undefined,
        winner: lots[1][0].winner || undefined,
      };
    })
    .execute();
});
