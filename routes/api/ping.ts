import {Router} from "express";

const router = Router();
export default router;

/**
 * @api {all} /ping Проверить доступность сервера
 *
 * @apiDescription А также мини игра "Настольный теннис"
 *
 * @apiVersion 0.0.0
 * @apiName Ping
 * @apiGroup Utils
 * @apiPermission Гость
 *
 * @apiSuccess {boolean} pong Отбил ли сервер мячик?
 *
 * @apiUse v000CommonHeaders
 */
router.all("/", async (req, res) => {
  await res.achain
    .json(() => {
      return {
        pong: Math.random() >= 0.5,
      };
    })
    .execute();
});
