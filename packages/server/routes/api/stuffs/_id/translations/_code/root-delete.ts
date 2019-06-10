import Router from "express-promise-router";

import {accessLevel, StuffTranslation} from "src";

const router = Router({
  mergeParams: true,
});
export default router;

/**
 * @api {delete} /stuffs/:id/translations/:code Удалить перевод
 * @apiVersion 1.0.0
 * @apiName DeleteTranslation
 * @apiGroup Stuffs
 * @apiPermission Модератор
 *
 * @apiParam {string="1..9223372036854775807"} :id ID материала
 * @apiParam {string="ISO 639-1 в нижнем регистре"} :code Язык перевода
 *
 * @apiUse v100CommonErrors
 * @apiUse v100AuthViaAuthToken
 * @apiUse v100AccessLevelModerator
 * @apiUse v100ApiStuffsIdErrors
 */
router.use(accessLevel("moderator"), async (req, res) => {
  await StuffTranslation.destroy({
    where: {
      code: req.params.code,
      stuffId: req.params.id,
    },
  });

  res.status(204).send();
});
