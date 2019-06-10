import {celebrate} from "celebrate";
import Router from "express-promise-router";

import {accessLevel, authViaAuthToken, Entity, Joi} from "src";

const router = Router();
export default router;

/**
 * @api {get} /entities Получить список юридических лиц
 * @apiVersion 1.0.0
 * @apiName ListEntities
 * @apiGroup Entities
 * @apiPermission Модератор
 *
 * @apiDescription Результаты отсортированы по `name` в порядке возрастания
 *
 * @apiParam {string="0..100"} [limit='"100"'] Лимит
 * @apiParam {string="0..9223372036854775807"} [offset='"0"'] Оффсет
 *
 * @apiSuccess {object[]} data Данные
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
 * @apiUse v100AccessLevelModerator
 */
router.use(
  authViaAuthToken,
  accessLevel("moderator"),
  celebrate({
    query: Joi.object({
      limit: Joi.pgLimit(),
      offset: Joi.pgOffset(),
    }),
  }),
  async (req, res) => {
    const entities = await Entity.findAll({
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
      limit: req.query.limit,
      offset: req.query.offset,
      order: [["name", "ASC"]],
    });

    res.status(200).json({
      data: entities.map((entity) => ({
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
      })),
    });
  },
);
