import {Router} from "express";
import * as otplib from "otplib";

import {Const, IUserInstance, Sequelize} from "src";

const router = Router();
export default router;

/**
 * @api {get} /user/tfa/authenticator Сгенерировать новый секрет Google Authenticator
 * @apiVersion 0.0.0
 * @apiName UpdateAuthenticator
 * @apiGroup User
 * @apiPermission Пользователь
 *
 * @apiSuccess {string} keyuri URL для генерации QR кода
 * @apiSuccess {string} secret Секрет Google Authenticator
 *
 * @apiUse v000CommonHeaders
 * @apiUse v000AuthAuth
 */
router.get("/", async (req, res) => {
  let secret: string;
  let user: [number, IUserInstance[]];
  let keyuri: string;
  await res.achain
    .action(() => {
      secret = otplib.authenticator.generateSecret();
    })
    .action(async () => {
      user = await Sequelize.instance.user.update({
        authenticator: secret,
      }, {
        returning: true,
        where: {
          id: req.user.id as string,
        },
      });
    })
    .action(() => {
      keyuri = otplib.authenticator.keyuri(req.user.name as string,
        Const.AUTHENTICATOR_SERVICE, user[1][0].authenticator as string);
    })
    .json(() => {
      return {
        keyuri,
        secret: user[1][0].authenticator,
      };
    })
    .execute();
});
