import {celebrate} from "celebrate";
import Router from "express-promise-router";

import {accessLevel, bodyParser, Joi, Stuff} from "src";

const router = Router();
export default router;

/**
 * @api {post} /stuffs Создать новый материал
 * @apiVersion 1.0.0
 * @apiName CreateStuff
 * @apiGroup Stuffs
 * @apiPermission Модератор
 *
 * @apiParam {string="kg","piece"} amountType Единица измерения
 *
 * @apiSuccess (Created 201) {string="1..9223372036854775807"} id ID материала
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
      amountType: Joi.pgEnumAmountType().required(),
    }),
  }),
  async (req, res) => {
    const stuff = await Stuff.create({
      amountType: req.body.amountType,
    });

    res.status(201).json({
      id: stuff.id,
    });
  },
);
