import {
  BooleanUnit,
  ObjectUnit,
  PgBigSerialUnit,
  PgLimitUnit,
  PgOffsetUnit,
  RequestValidator,
} from "@alendo/express-req-validator";

import {Router} from "express";
import * as _ from "lodash";

import {ILotInstance, Sequelize} from "src";

const router = Router();
export default router;

// tslint:disable max-line-length
/**
 * @api {post} /lot/search Поиск по лотам
 * @apiVersion 0.0.0
 * @apiName Search
 * @apiGroup Lot
 * @apiPermission Пользователь
 *
 * @apiDescription Результаты отсортированы по дате начала аукциона в порядке убывания
 *
 * @apiParam {boolean} [iAmParticipant] Фильтр по тем лотам в которых пользователь принимал участие
 * @apiParam {string="1..9223372036854775807"} [id] Фильтр по ID лота
 * @apiParam {string="0..9223372036854775807"} [limit] Лимит
 * @apiParam {string="0..9223372036854775807"} [offset] Оффсет
 * @apiParam {string="1..9223372036854775807"} [stuffid] Фильтр по ID материала
 *
 * @apiSuccess {object[]} lots Массив лотов
 * @apiSuccess {string="до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки"} lots.amount
 * Количество материала > 0
 * @apiSuccess {string="kg","piece"} lots.amount_type Тип количества
 * @apiSuccess {object} lots.buffer
 * Интервал времени, который всегда должен оставаться между временем последней ставки и временем окончания аукциона
 * @apiSuccess {number} [lots.buffer.years] Годы
 * @apiSuccess {number} [lots.buffer.months] Месяцы
 * @apiSuccess {number} [lots.buffer.days] Дни
 * @apiSuccess {number} [lots.buffer.hours] Часы
 * @apiSuccess {number} [lots.buffer.minutes] Минуты
 * @apiSuccess {number} [lots.buffer.seconds] Секунды
 * @apiSuccess {number} [lots.buffer.milliseconds] Миллисекунды
 * @apiSuccess {string="ISO 4217:2015 в нижнем регистре"} lots.currency Валюта
 * @apiSuccess {string="ISO 8601"} lots.finish Время окончания аукциона
 * @apiSuccess {string="1..9223372036854775807"} lots.id ID лота
 * @apiSuccess {string="0..9223372036854775807"} lots.participants Число участников
 * @apiSuccess {string="ISO 8601"} lots.start Время начала аукциона
 * @apiSuccess {string="до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки"} lots.startbid
 * Начальная ставка >= 0
 * @apiSuccess {string="до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки"} lots.step
 * Шаг аукциона >= 0
 * @apiSuccess {string="1..9223372036854775807"} lots.stuffid ID материала
 * @apiSuccess {string="purchase", "sale"} lots.type Тип аукциона
 * @apiSuccess {string="до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки"} [lots.winbid]
 * Ставка победителя
 * @apiSuccess {string="1..9223372036854775807"} [lots.winner] ID победителя
 *
 * @apiError (Bad Request 400 - Параметр равен null) {string="OBJECT_NULL_VALUE"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр равен null) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр iAmParticipant неверный) {string="WRONG_BOOLEAN"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр iAmParticipant неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр id и stuffid неверный) {string="WRONG_PG_BIGSERIAL"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр id и stuffid неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр limit неверный) {string="WRONG_PG_LIMIT"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр limit неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр offset неверный) {string="WRONG_PG_OFFSET"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр offset неверный) {string} message Подробное описание ошибки
 *
 * @apiUse v000CommonHeaders
 * @apiUse v000AuthAuth
 */
router.post("/", new RequestValidator({
  body: {
    Unit: ObjectUnit,
    payload: {
      iAmParticipant: {
        Unit: BooleanUnit,
        optional: true,
      },
      id: {
        Unit: PgBigSerialUnit,
        optional: true,
      },
      limit: {
        Unit: PgLimitUnit,
        optional: true,
      },
      offset: {
        Unit: PgOffsetUnit,
        optional: true,
      },
      stuffid: {
        Unit: PgBigSerialUnit,
        optional: true,
      },
    },
  },
}).middleware, async (req, res) => {
  let result: ILotInstance[] = [];
  await res.achain
    .action(async () => {
      result = await Sequelize.instance.lot.findAll(_.pickBy({
        include: [req.body.value.iAmParticipant ? {
          model: Sequelize.instance.lotParticipants,
          where: _.pickBy({
            userid: req.body.value.iAmParticipant.value ? req.user.id : undefined,
          }, (v) => v !== undefined) as any,
        } : undefined as any].filter((o) => o !== undefined),
        limit: req.body.value.limit ? req.body.value.limit.value : undefined,
        offset: req.body.value.offset ? req.body.value.offset.value : undefined,
        order: [
          ["start", "DESC"],
        ],
        where: _.pickBy({
          id: req.body.value.id ? req.body.value.id.value : undefined,
          stuffid: req.body.value.stuffid ? req.body.value.stuffid.value : undefined,
        }, (v) => v !== undefined),
      }));
    })
    .json(() => {
      return {
        lots: result.map((lot) => {
          return {
            amount: lot.amount,
            amount_type: lot.amount_type,
            buffer: lot.buffer,
            currency: lot.currency,
            finish: lot.finish,
            id: lot.id,
            participants: lot.participants,
            start: lot.start,
            startbid: lot.startbid,
            step: lot.step,
            stuffid: lot.stuffid,
            type: lot.type,
            winbid: lot.winbid || undefined,
            winner: lot.winner || undefined,
          };
        }),
      };
    })
    .execute();
});
