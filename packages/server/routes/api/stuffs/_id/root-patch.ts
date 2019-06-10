import {celebrate} from "celebrate";
import Router from "express-promise-router";
import * as _ from "lodash";

import {accessLevel, bodyParser, Joi, Stuff} from "src";

const router = Router({
  mergeParams: true,
});
export default router;

/**
 * @api {patch} /stuffs/:id Изменить материал
 * @apiVersion 1.0.0
 * @apiName ChangeStuff
 * @apiGroup Stuffs
 * @apiPermission Модератор
 *
 * @apiParam {string="1..9223372036854775807"} :id ID материала
 * @apiParam {string="kg","piece"} [amountType] Единица измерения
 * @apiParam {boolean} [enabled] Включен ли материал?
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
      amountType: Joi.pgEnumAmountType(),
      enabled: Joi.boolean(),
    }),
  }),
  async (req, res) => {
    await Stuff.update(
      {
        amountType: req.body.amountType,
        enabled: req.body.enabled,
      },
      {
        where: {
          id: req.params.id,
        },
      },
    );

    res.status(204).send();
  },
);
