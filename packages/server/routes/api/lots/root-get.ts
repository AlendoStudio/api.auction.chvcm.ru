import {celebrate} from "celebrate";
import Router from "express-promise-router";

import {Joi, Lot} from "src";

const router = Router();
export default router;

/**
 * @api {get} /lots Получить список лотов
 * @apiVersion 1.0.0
 * @apiName ListLots
 * @apiGroup Lots
 * @apiPermission Пользователь
 *
 * @apiDescription Результаты отсортированы по дате начала аукциона в порядке убывания
 *
 * @apiParam {string="0..100"} [limit='"100"'] Лимит
 * @apiParam {string="0..9223372036854775807"} [offset='"0"'] Оффсет
 *
 * @apiSuccess {object[]} data Данные
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
 * @apiUse v100CommonErrors
 * @apiUse v100AuthViaAuthToken
 */
router.use(
  celebrate({
    query: Joi.object({
      limit: Joi.pgLimit(),
      offset: Joi.pgOffset(),
    }),
  }),
  async (req, res) => {
    const lots = await Lot.findAll({
      limit: req.query.limit,
      offset: req.query.offset,
      order: [["start", "DESC"]],
    });

    res.status(200).json({
      data: lots.map((lot) => ({
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
      })),
    });
  },
);
