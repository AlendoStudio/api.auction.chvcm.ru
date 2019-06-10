import Router from "express-promise-router";

import {Stuff} from "src";

const router = Router({
  mergeParams: true,
});
export default router;

/**
 * @api {get} /stuffs/:id Получить материал
 * @apiVersion 1.0.0
 * @apiName GetStuff
 * @apiGroup Stuffs
 * @apiPermission Пользователь
 *
 * @apiParam {string="1..9223372036854775807"} :id ID материала
 *
 * @apiSuccess {object} data Данные
 * @apiSuccess {string="kg","piece"} data.amountType Единица измерения
 * @apiSuccess {boolean} data.enabled Включен ли материал?
 * @apiSuccess {string="1..9223372036854775807"} data.id ID материала
 *
 * @apiUse v100CommonErrors
 * @apiUse v100AuthViaAuthToken
 * @apiUse v100ApiStuffsIdErrors
 */
router.use(async (req, res) => {
  const stuff = (await Stuff.findByPk(req.params.id)) as Stuff;

  res.status(200).json({
    data: {
      amountType: stuff.amountType,
      enabled: stuff.enabled,
      id: stuff.id,
    },
  });
});
