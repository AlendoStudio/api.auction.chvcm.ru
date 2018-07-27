import {
  ObjectUnit,
  PgBigSerialUnit,
  PgDateUnit,
  PgDateUnitCodes,
  PgEnumUnit,
  PgEnumUnitCacheMemory,
  PgEnumUnitClient,
  PgIntervalObjectUnit,
  PgIntervalUnitCodes,
  PgNumericUnit,
  RequestValidator,
} from "@alendo/express-req-validator";
import {ChainCodes} from "@alendo/express-res-chain";

import {Router} from "express";

import {
  ApiCodes,
  Auth,
  ILotInstance,
  IStuffInstance,
  Sequelize,
} from "src";

const router = Router();
export default router;

router.use(Auth.requireModerator);

function intervalOverflowCode(error?: Error) {
  return error ? ChainCodes.INTERNAL_SERVER_ERROR : PgIntervalUnitCodes.WRONG_PG_INTERVAL;
}

function intervalOverflowMessage(error?: Error) {
  return error ? error.message : `body.buffer: interval out of range`;
}

function intervalOverflowStatus(error?: Error) {
  return error ? 500 : 400;
}

/**
 * @api {post} /lot Создать новый лот
 * @apiVersion 0.0.0
 * @apiName Create
 * @apiGroup Lot
 * @apiPermission Модератор
 *
 * @apiParam {string="до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки"} amount
 * Количество материала > 0
 * @apiParam {string="kg","piece"} amount_type Тип количества
 * @apiParam {object} buffer
 * Интервал времени, который всегда должен оставаться между временем последней ставки и временем окончания аукциона
 * @apiParam {number} [buffer.years] Годы
 * @apiParam {number} [buffer.months] Месяцы
 * @apiParam {number} [buffer.days] Дни
 * @apiParam {number} [buffer.hours] Часы
 * @apiParam {number} [buffer.minutes] Минуты
 * @apiParam {number} [buffer.seconds] Секунды
 * @apiParam {number} [buffer.milliseconds] Миллисекунды
 * @apiParam {string="ISO 4217:2015 в нижнем регистре"} currency Валюта
 * @apiParam {string="ISO 8601"} finish Время окончания аукциона
 * @apiParam {string="ISO 8601"} start Время начала аукциона
 * @apiParam {string="до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки"} startbid
 * Начальная ставка >= 0
 * @apiParam {string="до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки"} step
 * Шаг аукциона >= 0
 * @apiParam {string="1..9223372036854775807"} stuffid ID материала
 * @apiParam {string="purchase", "sale"} type Тип аукциона
 *
 * @apiSuccess {string="1..9223372036854775807"} id ID лота
 *
 * @apiError (Bad Request 400 - Пропущен параметр) {string="OBJECT_MISSING_KEY"} code Код ошибки
 * @apiError (Bad Request 400 - Пропущен параметр) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр равен null) {string="OBJECT_NULL_VALUE"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр равен null) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр amount, startbid или step неверный) {string="WRONG_PG_NUMERIC"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр amount, startbid или step неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр amount_type, currency или type неверный) {string="WRONG_PG_ENUM"} code
 * Код ошибки
 * @apiError (Bad Request 400 - Параметр amount_type, currency или type неверный) {string} message
 * Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр buffer неверный) {string="WRONG_PG_INTERVAL"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр buffer неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр finish или start неверный) {string="WRONG_PG_DATE"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр finish или start неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр stuffid неверный) {string="WRONG_PG_BIGSERIAL"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр stuffid неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Материал не найден) {string="DB_STUFF_NOT_FOUND_BY_ID"} code Код ошибки
 * @apiError (Bad Request 400 - Материал не найден) {string} message Подробное описание ошибки
 *
 * @apiUse v000CommonHeaders
 * @apiUse v000AuthAuth
 * @apiUse v000AuthRequireModerator
 */
router.post("/", new RequestValidator({
  body: {
    Unit: ObjectUnit,
    payload: {
      [ObjectUnit.FILTER]: true,
      amount: {
        Unit: PgNumericUnit,
        payload: {
          disallowNegative: true,
          disallowZero: true,
        },
      },
      amount_type: {
        Unit: PgEnumUnit,
        payload: {
          cache: PgEnumUnitCacheMemory,
          client: PgEnumUnitClient,
          enumName: "LOT_AMOUNT_TYPE",
        },
      },
      buffer: {
        Unit: PgIntervalObjectUnit,
      },
      currency: {
        Unit: PgEnumUnit,
        payload: {
          cache: PgEnumUnitCacheMemory,
          client: PgEnumUnitClient,
          enumName: "CURRENCY",
        },
      },
      finish: {
        Unit: PgDateUnit,
      },
      start: {
        Unit: PgDateUnit,
      },
      startbid: {
        Unit: PgNumericUnit,
        payload: {
          disallowNegative: true,
        },
      },
      step: {
        Unit: PgNumericUnit,
        payload: {
          disallowNegative: true,
        },
      },
      stuffid: {
        Unit: PgBigSerialUnit,
      },
      type: {
        Unit: PgEnumUnit,
        payload: {
          cache: PgEnumUnitCacheMemory,
          client: PgEnumUnitClient,
          enumName: "LOT_TYPE",
        },
      },
    },
  },
}).middleware, async (req, res, next) => {
  await res.achain
    .check(() => {
      return (req.body.value.start as PgDateUnit).value.getTime() > Date.now();
    }, PgDateUnitCodes.WRONG_PG_DATE, "start must be in future", 400)
    .check(() => {
      return (req.body.value.start as PgDateUnit)
        .value.getTime() < (req.body.value.finish as PgDateUnit).value.getTime();
    }, PgDateUnitCodes.WRONG_PG_DATE, "start must be less then finish", 400)
    .execute(next);
}, async (req, res) => {
  let lot: ILotInstance;
  let stuff: IStuffInstance | null;
  await res.achain
    .action(async () => {
      stuff = await Sequelize.instance.stuff.findById(req.body.value.stuffid.value, {
        attributes: ["id"],
      });
    })
    .check(() => {
      return !!stuff;
    }, ApiCodes.DB_STUFF_NOT_FOUND_BY_ID, "stuff with same id not found", 400)
    .check(async () => {
      try {
        lot = await Sequelize.instance.lot.create((req.body as ObjectUnit).mappedValues, {
          returning: true,
        });
        return true;
        // TODO: запуск двух таймеров
        // #1 - на время старта (отправить всем валидным участникам уведомление за 3 дня)
        // #2 - на время финиша (отправить победителю сообщение о том, что он победил)
      } catch (error) {
        if (error.message !== "interval out of range") {
          throw error;
        }
        return false;
      }
    }, intervalOverflowCode, intervalOverflowMessage, intervalOverflowStatus)
    .json(() => {
      return {
        id: lot.id,
      };
    })
    .execute();
});
