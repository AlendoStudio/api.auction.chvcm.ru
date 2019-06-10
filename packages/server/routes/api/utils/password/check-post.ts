import {celebrate} from "celebrate";
import Router from "express-promise-router";
import * as zxcvbn from "zxcvbn";

import {bodyParser, Const, Joi} from "src";

const router = Router();
export default router;

/**
 * @api {post} /utils/password/check Проверить пароль
 * @apiVersion 1.0.0
 * @apiName CheckPassword
 * @apiGroup Utils
 * @apiPermission Гость
 *
 * @apiParam {string} password Пароль (учитываются только первые 72 символа)
 *
 * @apiSuccess {object} score Рейтинг пароля
 * @apiSuccess {number=0,1,2,3,4} score.actual Текущий рейтинг пароля
 * @apiSuccess {number=1,3} score.expected Минимально резрешенный рейтинг пароля
 * @apiSuccess {number=4} score.max Максимальный рейтинг пароля
 * @apiSuccess {number=0} score.min Минимальный рейтинг пароля
 *
 * @apiUse v100CommonErrors
 */
router.use(
  bodyParser(),
  celebrate({
    body: Joi.object({
      password: Joi.string()
        .max(72)
        .required(),
    }),
  }),
  async (req, res) => {
    res.status(200).json({
      score: {
        actual: zxcvbn(req.body.password).score,
        expected: Const.MINIMUM_PASSWORD_SCORE,
        max: 4,
        min: 0,
      },
    });
  },
);
