import Router from "express-promise-router";
import * as assert from "http-assert";

import {ApiCodes, Lot} from "src";

const router = Router({
  mergeParams: true,
});
export default router;

/**
 * @api {get} /lots/:id Получить лот
 * @apiVersion 1.0.0
 * @apiName GetLot
 * @apiGroup Lots
 * @apiPermission Пользователь
 *
 * @apiParam {string="1..9223372036854775807"} :id ID лота
 *
 * @apiSuccess {object} data Данные
 * @apiSuccess {string="до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки"} data.amount Количество материала > 0
 * @apiSuccess {object} data.buffer Интервал времени, который всегда должен оставаться между временем последней ставки и временем окончания аукциона
 * @apiSuccess {number} [data.buffer.years] Годы >= 0
 * @apiSuccess {number} [data.buffer.months] Месяцы >= 0
 * @apiSuccess {number} [data.buffer.days] Дни >= 0
 * @apiSuccess {number} [data.buffer.hours] Часы >= 0
 * @apiSuccess {number} [data.buffer.minutes] Минуты >= 0
 * @apiSuccess {number} [data.buffer.seconds] Секунды >= 0
 * @apiSuccess {number} [data.buffer.milliseconds] Миллисекунды >= 0
 * @apiSuccess {string="ISO 4217:2015 в нижнем регистре"} data.currency Валюта
 * @apiSuccess {string="ISO 8601"} data.finish Время окончания аукциона
 * @apiSuccess {string="1..9223372036854775807"} data.id ID лота
 * @apiSuccess {string="0..9223372036854775807"} data.participants Число участников
 * @apiSuccess {string="ISO 8601"} data.start Время начала аукциона
 * @apiSuccess {string="до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки"} data.startBid Начальная ставка >= 0
 * @apiSuccess {string="до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки"} data.step Шаг аукциона >= 0
 * @apiSuccess {boolean} data.strict Автовычисление ставки
 * @apiSuccess {string="1..9223372036854775807"} data.stuffId ID материала
 * @apiSuccess {string="purchase", "sale"} data.type Тип аукциона
 * @apiSuccess {string="до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки"} data.winnerBid Ставка победителя >= 0 (может быть `null`)
 * @apiSuccess {string="1..9223372036854775807"} data.winnerId ID победителя (может быть `null`)
 *
 * @apiError (Not Found 404 - Лот не найден) {string="LOT_NOT_FOUND_BY_ID"} code Код ошибки
 * @apiError (Not Found 404 - Лот не найден) {string} message Подробное описание ошибки
 *
 * @apiUse v100CommonErrors
 * @apiUse v100AuthViaAuthToken
 */
router.use(async (req, res) => {
  const lot = (await Lot.findByPk(req.params.id)) as Lot;
  assert(lot, 404, "lot with same id not found", {
    code: ApiCodes.LOT_NOT_FOUND_BY_ID,
  });

  res.status(200).json({
    data: {
      amount: lot.amount,
      buffer: lot.buffer,
      currency: lot.currency,
      finish: lot.finish,
      id: lot.id,
      participants: lot.participants,
      start: lot.start,
      startBid: lot.startBid,
      step: lot.step,
      strict: lot.strict,
      stuffId: lot.stuffId,
      type: lot.type,
      winnerBid: lot.winnerBid,
      winnerId: lot.winnerId,
    },
  });
});
