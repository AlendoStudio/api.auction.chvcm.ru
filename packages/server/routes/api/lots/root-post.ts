import {celebrate} from "celebrate";
import Router from "express-promise-router";
import * as assert from "http-assert";

import {
  accessLevel,
  ApiCodes,
  bodyParser,
  Joi,
  Lot,
  SocketNotifications,
  Stuff,
} from "src";

const router = Router();
export default router;

/**
 * @api {post} /lots Создать новый лот
 * @apiVersion 1.0.0
 * @apiName CreateLot
 * @apiGroup Lots
 * @apiPermission Модератор
 *
 * @apiParam {string="до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки"} amount Количество материала > 0
 * @apiParam {object} buffer Интервал времени, который всегда должен оставаться между временем последней ставки и временем окончания аукциона
 * @apiParam {number} [buffer.years] Годы >= 0
 * @apiParam {number} [buffer.months] Месяцы >= 0
 * @apiParam {number} [buffer.days] Дни >= 0
 * @apiParam {number} [buffer.hours] Часы >= 0
 * @apiParam {number} [buffer.minutes] Минуты >= 0
 * @apiParam {number} [buffer.seconds] Секунды >= 0
 * @apiParam {number} [buffer.milliseconds] Миллисекунды >= 0
 * @apiParam {string="ISO 4217:2015 в нижнем регистре"} currency Валюта
 * @apiParam {string="ISO 8601"} finish Время окончания аукциона (не может быть раньше времени начала)
 * @apiParam {string="ISO 8601"} start Время начала аукциона (не может быть в прошлом)
 * @apiParam {string="до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки"} startBid Начальная ставка >= 0
 * @apiParam {string="до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки"} step Шаг аукциона >= 0
 * @apiParam {boolean} strict Автовычисление ставки
 * @apiParam {string="1..9223372036854775807"} stuffId ID материала
 * @apiParam {string="purchase", "sale"} type Тип аукциона
 *
 * @apiSuccess (Created 201) {string="1..9223372036854775807"} id ID лота
 *
 * @apiUse v100SocketNotificationsLotsLot
 *
 * @apiError (Not Found 404 - Материал не найден) {string="STUFF_NOT_FOUND_BY_ID"} code Код ошибки
 * @apiError (Not Found 404 - Материал не найден) {string} message Подробное описание ошибки
 *
 * @apiUse v100CommonErrors
 * @apiUse v100AuthViaAuthToken
 * @apiUse v100AccessLevelModerator
 */
router.use(
  accessLevel("moderator"),
  bodyParser(),
  celebrate({
    body: Joi.object({
      amount: Joi.pgNumeric()
        .positive()
        .invalid("0", 0)
        .required(),
      buffer: Joi.pgInterval().required(),
      currency: Joi.pgEnumCurrency().required(),
      finish: Joi.date()
        .iso()
        .required(),
      start: Joi.date()
        .iso()
        .greater("now")
        .less(Joi.ref("finish"))
        .required(),
      startBid: Joi.pgNumeric()
        .positive()
        .required(),
      step: Joi.pgNumeric()
        .positive()
        .required(),
      strict: Joi.boolean().required(),
      stuffId: Joi.pgBigSerial().required(),
      type: Joi.string()
        .valid("purchase", "sale")
        .required(),
    }),
  }),
  async (req, res) => {
    assert(
      await Stuff.count({
        where: {
          id: req.body.stuffId,
        },
      }),
      404,
      "stuff with same id not found",
      {code: ApiCodes.STUFF_NOT_FOUND_BY_ID},
    );

    let lot: Lot;
    try {
      lot = await Lot.create({
        amount: req.body.amount,
        buffer: req.body.buffer,
        currency: req.body.currency,
        finish: req.body.finish,
        start: req.body.start,
        startBid: req.body.startBid,
        step: req.body.step,
        strict: req.body.strict,
        stuffId: req.body.stuffId,
        type: req.body.type,
      });
    } catch (error) {
      assert(
        error.message !== "interval out of range",
        400,
        `child "buffer" fails because ["buffer" out of range]`,
      );
      throw error;
    }

    res.status(201).json({
      id: lot.id,
    });

    SocketNotifications.lotsLot(lot);
  },
);
