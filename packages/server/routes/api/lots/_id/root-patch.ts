import {celebrate} from "celebrate";
import Router from "express-promise-router";
import * as assert from "http-assert";
import * as _ from "lodash";
import {Op} from "sequelize";

import {accessLevel, bodyParser, Joi, Lot, SocketNotifications} from "src";

const router = Router({
  mergeParams: true,
});
export default router;

/**
 * @api {patch} /lots/:id Изменить лот
 * @apiVersion 1.0.0
 * @apiName ChangeLot
 * @apiGroup Lots
 * @apiPermission Проверенное юридическое лицо
 *
 * @apiParam {string="1..9223372036854775807"} :id ID лота
 * @apiParam {string="до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки"} [winnerBid] Ставка победителя >= 0
 *
 * @apiUse v100SocketNotificationsLotsLot
 *
 * @apiUse v100CommonErrors
 * @apiUse v100AuthViaAuthToken
 * @apiUse v100AccessLevelVerifiedEntity
 */
router.use(
  accessLevel("verifiedEntity"),
  bodyParser(),
  celebrate({
    body: Joi.object({
      winnerBid: Joi.pgNumeric().positive(),
    }),
  }),
  async (req, res) => {
    let lots: [number, Lot[]];
    try {
      lots = await Lot.update(
        {
          winnerBid: req.body.winnerBid,
          winnerId: req.entity.id,
        },
        {
          returning: true,
          where: {
            finish: {
              [Op.gt]: new Date(),
            },
            id: req.params.id,
            start: {
              [Op.lt]: new Date(),
            },
          },
        },
      );
    } catch (error) {
      assert(
        error.message !== "value overflows numeric format",
        400,
        `child "winnerBid" fails because ["winnerBid" overflows numeric format]`,
      );
      throw error;
    }

    res.status(204).send();

    lots[1].map((lot) => SocketNotifications.lotsLot(lot));
  },
);
