import {Lot} from "../models";
import {Web} from "../web";

/**
 * Socket.IO notifications
 */
export class SocketNotifications {
  /**
   * @apiDefine v100SocketNotificationsLotsLot
   *
   * @apiSuccess (Socket "lot") {string="до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки"} amount Количество материала > 0
   * @apiSuccess (Socket "lot") {object} buffer Интервал времени, который всегда должен оставаться между временем последней ставки и временем окончания аукциона
   * @apiSuccess (Socket "lot") {number} [buffer.years] Годы >= 0
   * @apiSuccess (Socket "lot") {number} [buffer.months] Месяцы >= 0
   * @apiSuccess (Socket "lot") {number} [buffer.days] Дни >= 0
   * @apiSuccess (Socket "lot") {number} [buffer.hours] Часы >= 0
   * @apiSuccess (Socket "lot") {number} [buffer.minutes] Минуты >= 0
   * @apiSuccess (Socket "lot") {number} [buffer.seconds] Секунды >= 0
   * @apiSuccess (Socket "lot") {number} [buffer.milliseconds] Миллисекунды >= 0
   * @apiSuccess (Socket "lot") {string="ISO 4217:2015 в нижнем регистре"} currency Валюта
   * @apiSuccess (Socket "lot") {string="ISO 8601"} finish Время окончания аукциона
   * @apiSuccess (Socket "lot") {string="1..9223372036854775807"} id ID лота
   * @apiSuccess (Socket "lot") {string="0..9223372036854775807"} participants Число участников
   * @apiSuccess (Socket "lot") {string="ISO 8601"} start Время начала аукциона
   * @apiSuccess (Socket "lot") {string="до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки"} startBid Начальная ставка >= 0
   * @apiSuccess (Socket "lot") {string="до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки"} step Шаг аукциона >= 0
   * @apiSuccess (Socket "lot") {boolean} strict Автовычисление ставки
   * @apiSuccess (Socket "lot") {string="1..9223372036854775807"} stuffId ID материала
   * @apiSuccess (Socket "lot") {string="purchase", "sale"} type Тип аукциона
   * @apiSuccess (Socket "lot") {string="до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки"} winnerBid Ставка победителя >= 0 (может быть `null`)
   * @apiSuccess (Socket "lot") {string="1..9223372036854775807"} winnerId ID победителя (может быть `null`)
   */

  /**
   * "lot" notification in "lots" room
   * @param lot Lot
   */
  public static lotsLot(lot: Lot): void {
    Web.instance.nsp.to("lots").emit("lot", {
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
    });
  }
}
