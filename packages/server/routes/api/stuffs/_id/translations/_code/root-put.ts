import {celebrate} from "celebrate";
import Router from "express-promise-router";

import {accessLevel, bodyParser, Joi, StuffTranslation} from "src";

const router = Router({
  mergeParams: true,
});
export default router;

/**
 * @api {put} /stuffs/:id/translations/:code Перевести материал
 * @apiVersion 1.0.0
 * @apiName TranslateStuff
 * @apiGroup Stuffs
 * @apiPermission Модератор
 *
 * @apiParam {string="1..9223372036854775807"} :id ID материала
 * @apiParam {string="ISO 639-1 в нижнем регистре"} :code Язык перевода
 * @apiParam {string} title Название материала
 * @apiParam {string} [description='""'] Описание материала (может быть пустым)
 *
 * @apiUse v100CommonErrors
 * @apiUse v100AuthViaAuthToken
 * @apiUse v100AccessLevelModerator
 * @apiUse v100ApiStuffsIdErrors
 */
router.use(
  accessLevel("moderator"),
  bodyParser(),
  celebrate({
    body: Joi.object({
      description: Joi.string()
        .allow("")
        .default(""),
      title: Joi.string().required(),
    }),
  }),
  async (req, res) => {
    await StuffTranslation.upsert({
      code: req.params.code,
      description: req.body.description,
      stuffId: req.params.id,
      title: req.body.title,
    });

    res.status(204).send();
  },
);
