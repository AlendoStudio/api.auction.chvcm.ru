import Router from "express-promise-router";

import {Entity} from "src";

const router = Router({
  mergeParams: true,
});
export default router;

/**
 * @api {get} /entities/:id Получить юридическое лицо
 * @apiVersion 1.0.0
 * @apiName GetEntity
 * @apiGroup Entities
 * @apiPermission Юридическое лицо или модератор
 *
 * @apiParam {string="1..9223372036854775807"} :id ID юридического лица
 *
 * @apiSuccess {object} data Данные
 * @apiSuccess {boolean} data.banned Забанено ли юридическое лицо?
 * @apiSuccess {string} data.ceo Директор
 * @apiSuccess {string} data.email Email
 * @apiSuccess {string="1..9223372036854775807"} data.id ID юридического лица
 * @apiSuccess {string} data.itn Идентификационный номер налогоплательщика
 * @apiSuccess {string="ISO 639-1 в нижнем регистре"} data.language Язык
 * @apiSuccess {string} data.name Название огранизации
 * @apiSuccess {string} data.phone Телефон
 * @apiSuccess {string} data.psrn Основной государственный регистрационный номер
 * @apiSuccess {string="ISO 8601"} data.registration Дата регистрации
 * @apiSuccess {boolean} data.verified Проверено ли юридическое лицо?
 *
 * @apiUse v100CommonErrors
 * @apiUse v100AuthViaAuthToken
 * @apiUse v100ApiEntitiesIdErrors
 */
router.use(async (req, res) => {
  const entity = (await Entity.findByPk(req.params.id, {
    attributes: [
      "banned",
      "ceo",
      "email",
      "id",
      "itn",
      "language",
      "name",
      "phone",
      "psrn",
      "registration",
      "verified",
    ],
  })) as Entity;

  res.status(200).json({
    data: {
      banned: entity.banned,
      ceo: entity.ceo,
      email: entity.email,
      id: entity.id,
      itn: entity.itn,
      language: entity.language,
      name: entity.name,
      phone: entity.phone,
      psrn: entity.psrn,
      registration: entity.registration,
      verified: entity.verified,
    },
  });
});
