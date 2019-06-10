import {celebrate} from "celebrate";
import Router from "express-promise-router";
import * as _ from "lodash";

import {bodyParser, EmailNotifications, Entity, Joi, renderMarkdown} from "src";

const router = Router({
  mergeParams: true,
});
export default router;

/**
 * @api {patch} /entities/:id Изменить юридическое лицо
 * @apiVersion 1.0.0
 * @apiName ChangeEntity
 * @apiGroup Entities
 * @apiPermission Юридическое лицо или модератор
 *
 * @apiParam {string="1..9223372036854775807"} :id ID юридического лица
 * @apiParam {string} [banMessage] Сообщение о причине блокировки в markdown (вставляется в email сообщение)
 * @apiParam {boolean} [banned] Забанено ли юридическое лицо (только для модератора)?
 * @apiParam {string} [ceo] Директор
 * @apiParam {string} [name] Название огранизации
 * @apiParam {boolean} [verified] Проверено ли юридическое лицо (только для модератора)?
 *
 * @apiUse v100CommonErrors
 * @apiUse v100AuthViaAuthToken
 * @apiUse v100ApiEntitiesIdErrors
 */
router.use(
  bodyParser(),
  celebrate({
    body: Joi.object({
      banMessage: Joi.string(),
      banned: Joi.boolean(),
      ceo: Joi.string(),
      name: Joi.string(),
      verified: Joi.boolean(),
    }),
  }),
  async (req, res) => {
    if (!req.employee) {
      delete req.body.banMessage;
      delete req.body.banned;
      delete req.body.verified;
    }

    if (req.body.banMessage) {
      req.body.banMessage = await renderMarkdown(req.body.banMessage);
    }

    req.body.verified =
      req.body.banned ||
      (req.body.banned !== false && req.entity.banned) ||
      (!_.isUndefined(req.body.ceo) && req.body.ceo !== req.entity.ceo) ||
      (!_.isUndefined(req.body.name) && req.body.name !== req.entity.name)
        ? false
        : req.body.verified;

    await Entity.update(
      {
        banned: req.body.banned,
        ceo: req.body.ceo,
        name: req.body.name,
        verified: req.body.verified,
      },
      {
        where: {
          id: req.params.id,
        },
      },
    );

    res.status(204).send();

    if (
      !_.isUndefined(req.body.banned) &&
      req.body.banned !== req.entity.banned
    ) {
      if (req.body.banned) {
        await EmailNotifications.instance.banned(
          {
            email: req.entity.email,
            language: req.entity.language,
            name: req.body.name || req.entity.name,
          },
          req.body.banMessage,
        );
      } else {
        await EmailNotifications.instance.unbanned({
          email: req.entity.email,
          language: req.entity.language,
          name: req.body.name || req.entity.name,
        });
      }
    }

    if (
      !req.body.banned &&
      !_.isUndefined(req.body.verified) &&
      req.body.verified !== req.entity.verified
    ) {
      if (req.body.verified) {
        await EmailNotifications.instance.verified({
          email: req.entity.email,
          language: req.entity.language,
          name: req.body.name || req.entity.name,
        });
      } else {
        await EmailNotifications.instance.unverified({
          email: req.entity.email,
          language: req.entity.language,
          name: req.body.name || req.entity.name,
        });
      }
    }
  },
);
