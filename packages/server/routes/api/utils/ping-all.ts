import Router from "express-promise-router";

const router = Router();
export default router;

/**
 * @api {all} /utils/ping Проверить доступность сервера
 *
 * @apiDescription А также мини игра "Настольный теннис"
 *
 * @apiVersion 1.0.0
 * @apiName Ping
 * @apiGroup Utils
 * @apiPermission Гость
 *
 * @apiSuccess {boolean=true} pong Отбил ли сервер мячик?
 *
 * @apiUse v100CommonErrors
 */
router.use(async (req, res) => {
  res.status(200).json({
    pong: true,
  });
});
