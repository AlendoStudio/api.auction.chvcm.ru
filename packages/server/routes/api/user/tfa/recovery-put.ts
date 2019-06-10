import Router from "express-promise-router";

import {Const, Sequelize, TokenTfaRecovery} from "src";

const router = Router();
export default router;

/**
 * @api {put} /user/tfa/recovery Сгенерировать новые коды восстановления
 * @apiVersion 1.0.0
 * @apiName GenerateRecoveryCodes
 * @apiGroup User
 * @apiPermission Пользователь
 *
 * @apiSuccess {string[]} tokens Коды восстановления (10 элементов по умолчанию)
 *
 * @apiUse v100CommonErrors
 * @apiUse v100AuthViaAuthToken
 */
router.use(async (req, res) => {
  let tokens: TokenTfaRecovery[] = [];
  await Sequelize.instance.transaction(async () => {
    await TokenTfaRecovery.destroy({
      where: {
        userId: req.user.id as string,
      },
    });

    tokens = await TokenTfaRecovery.bulkCreate(
      new Array(Const.TFA_RECOVERY_CODES_COUNT).fill({
        userId: req.user.id,
      }),
      {
        returning: true,
      },
    );
  });

  res.status(200).json({
    tokens: tokens.map((item) => item.token),
  });
});
