import {Router} from "express";

import {Const, ITokensTfaRecoveryInstance, Sequelize} from "src";

const router = Router();
export default router;

/**
 * @api {get} /user/tfa/recovery Сгенерировать новые коды восстановления
 * @apiVersion 0.0.0
 * @apiName UpdateTfaRecoveryTokens
 * @apiGroup User
 * @apiPermission Пользователь
 *
 * @apiSuccess {string[]} tokens Коды восстановления (10 элементов по умолчанию)
 *
 * @apiUse v000CommonHeaders
 * @apiUse v000AuthAuth
 */
router.get("/", async (req, res) => {
  let tokens: ITokensTfaRecoveryInstance[] = [];
  await res.achain
    .action(async () => {
      await Sequelize.instance.transaction(async () => {
        await Sequelize.instance.tokensTfaRecovery.destroy({
          where: {
            userid: req.user.id as string,
          },
        });
        tokens = await Sequelize.instance.tokensTfaRecovery.bulkCreate(Array(Const.TFA_RECOVERY_CODES_COUNT).fill({
          userid: req.user.id,
        }), {
          returning: true,
        });
      });
    })
    .json(() => {
      return {
        tokens: tokens.map((item) => item.token),
      };
    })
    .execute();
});
