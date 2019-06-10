import {celebrate} from "celebrate";
import Router from "express-promise-router";

import {Joi, Stuff} from "src";

const router = Router();
export default router;

/**
 * @api {get} /stuffs Получить список материалов
 * @apiVersion 1.0.0
 * @apiName ListStuffs
 * @apiGroup Stuffs
 * @apiPermission Пользователь
 *
 * @apiDescription Результаты отсортированы в порядке возрастания ID материала
 *
 * @apiParam {string="0..100"} [limit='"100"'] Лимит
 * @apiParam {string="0..9223372036854775807"} [offset='"0"'] Оффсет
 *
 * @apiSuccess {object[]} data Данные
 * @apiSuccess {string="kg","piece"} data.amountType Единица измерения
 * @apiSuccess {boolean} data.enabled Включен ли материал?
 * @apiSuccess {string="1..9223372036854775807"} data.id ID материала
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
    const stuffs = await Stuff.findAll({
      limit: req.query.limit,
      offset: req.query.offset,
      order: [["id", "ASC"]],
    });

    res.status(200).json({
      data: stuffs.map((stuff) => ({
        amountType: stuff.amountType,
        enabled: stuff.enabled,
        id: stuff.id,
      })),
    });
  },
);
