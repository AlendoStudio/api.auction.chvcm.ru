import {NotEmptyStringUnit, ObjectUnit, PgBigSerialUnit, RequestValidator} from "@alendo/express-req-validator";

import {Request, Response, Router} from "express";

import {
  Auth,
  EmailNotifications,
  IAttachmentInstance,
  Sequelize,
} from "src";

const router = Router();
export default router;

/**
 * @api {post} /attachment Создать или обновить вложение
 * @apiVersion 0.0.0
 * @apiName Create
 * @apiGroup Attachment
 * @apiPermission Юридическое лицо
 *
 * @apiParam {string} url URL
 *
 * @apiError (Bad Request 400 - Пропущен параметр) {string="OBJECT_MISSING_KEY"} code Код ошибки
 * @apiError (Bad Request 400 - Пропущен параметр) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр равен null) {string="OBJECT_NULL_VALUE"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр равен null) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр url неверный) {string="WRONG_NOT_EMPTY_STRING"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр url неверный) {string} message Подробное описание ошибки
 *
 * @apiUse v000CommonHeaders
 * @apiUse v000AuthAuth
 * @apiUse v000AuthRequireEntity
 */
router.post("/", Auth.requireEntity, new RequestValidator({
  body: {
    Unit: ObjectUnit,
    payload: {
      url: {
        Unit: NotEmptyStringUnit,
      },
    },
  },
}).middleware, async (req, res) => {
  await res.achain
    .action(async () => {
      await Sequelize.instance.transaction(async () => {
        await Sequelize.instance.attachment.insertOrUpdate({
          url: req.body.value.url.value,
          userid: req.entity.id,
        });
        if (req.entity.verified) {
          await Sequelize.instance.entity.update({
            verified: false,
          }, {
            where: {
              id: req.entity.id as string,
            },
          });
          await EmailNotifications.instance.unverified(req.entity);
        }
      });
    })
    .send204()
    .execute();
});

function findAttachmentById(getId: (req: Request) => string) {
  return async (req: Request, res: Response) => {
    let attachment: IAttachmentInstance | null = null;
    await res.achain
      .action(async () => {
        attachment = await Sequelize.instance.attachment.findById(getId(req), {
          attributes: ["url"],
        });
      })
      .json(() => {
        return {
          url: attachment ? attachment.url : undefined,
        };
      })
      .execute();
  };
}

/**
 * @api {get} /attachment Получить вложение
 * @apiVersion 0.0.0
 * @apiName Get
 * @apiGroup Attachment
 * @apiPermission Юридическое лицо
 *
 * @apiSuccess {string} [url] URL
 *
 * @apiUse v000CommonHeaders
 * @apiUse v000AuthAuth
 * @apiUse v000AuthRequireEntity
 */
router.get("/", Auth.requireEntity, findAttachmentById((req) => req.entity.id as string));

/**
 * @api {get} /attachment/:id Получить вложение юридического лица
 * @apiVersion 0.0.0
 * @apiName GetById
 * @apiGroup Attachment
 * @apiPermission Модератор
 *
 * @apiParam {string="1..9223372036854775807"} :id ID юридического лица
 *
 * @apiSuccess {string} [url] URL
 *
 * @apiError (Bad Request 400 - Параметр :id неверный) {string="WRONG_PG_BIGSERIAL"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр :id неверный) {string} message Подробное описание ошибки
 *
 * @apiUse v000CommonHeaders
 * @apiUse v000AuthAuth
 * @apiUse v000AuthRequireModerator
 */
router.get("/:id", Auth.requireModerator, new RequestValidator({
  params: {
    Unit: ObjectUnit,
    payload: {
      id: {
        Unit: PgBigSerialUnit,
      },
    },
  },
}).middleware, findAttachmentById((req) => req.params.value.id.value));
