import {BooleanUnit, ObjectUnit, PgBigSerialUnit, RequestValidator} from "@alendo/express-req-validator";

import {Router} from "express";
import * as _ from "lodash";

import {ApiCodes, EmailNotifications, IEntityInstance, Sequelize} from "src";

const router = Router();
export default router;

/**
 * @api {post} /entity/:id Изменить юридическое лицо
 * @apiVersion 0.0.0
 * @apiName Update
 * @apiGroup Entity
 * @apiPermission Модератор
 *
 * @apiParam {string="1..9223372036854775807"} :id ID юридического лица
 * @apiParam {boolean} [banned] Забанено ли юридическое лицо?
 * @apiParam {boolean} [verified] Проверено ли юридическое лицо?
 *
 * @apiError (Bad Request 400 - Параметр равен null) {string="OBJECT_NULL_VALUE"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр равен null) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр :id неверный) {string="WRONG_PG_BIGSERIAL"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр :id неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр banned или verified неверный) {string="WRONG_BOOLEAN"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр banned или verified неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Юридическое лицо не найдено) {string="DB_ENTITY_NOT_FOUND_BY_ID"} code Код ошибки
 * @apiError (Bad Request 400 - Юридическое лицо не найдено) {string} message Подробное описание ошибки
 *
 * @apiUse v000CommonHeaders
 * @apiUse v000AuthAuth
 * @apiUse v000AuthRequireModerator
 */
router.post("/:id", new RequestValidator({
  body: {
    Unit: ObjectUnit,
    payload: {
      banned: {
        Unit: BooleanUnit,
        optional: true,
      },
      verified: {
        Unit: BooleanUnit,
        optional: true,
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
  let entity: IEntityInstance | null = null;
  await res.achain
    .action(async () => {
      entity = await Sequelize.instance.entity.findById(req.params.value.id.value);
    })
    .check(() => {
      return !!entity;
    }, ApiCodes.DB_ENTITY_NOT_FOUND_BY_ID, "entity with same id not found", 400)
    .action(async () => {
      await Sequelize.instance.transaction(async () => {
        await Sequelize.instance.entity.update(_.pickBy({
          banned: req.body.value.banned ? req.body.value.banned.value : undefined,
          verified: req.body.value.verified ? req.body.value.verified.value : undefined,
        }, (v) => v !== undefined), {
          where: {
            id: req.params.value.id.value,
          },
        });
        if (req.body.value.banned && req.body.value.banned.value !== (entity as IEntityInstance).banned) {
          if (req.body.value.banned.value) {
            await EmailNotifications.instance.banned(entity as IEntityInstance);
          } else {
            await EmailNotifications.instance.unbanned(entity as IEntityInstance);
          }
        }
        if (req.body.value.verified && req.body.value.verified.value !== (entity as IEntityInstance).verified) {
          if (req.body.value.verified.value) {
            await EmailNotifications.instance.verified(entity as IEntityInstance);
            // TODO: уведомление об акционах которые проходят в ближайшие 3 дня
            // (лучше эти данные включить в письмо "verified")
          } else {
            await EmailNotifications.instance.unverified(entity as IEntityInstance);
          }
        }
      });
    })
    .send204()
    .execute();
});
