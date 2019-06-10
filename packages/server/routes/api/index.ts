import Router from "express-promise-router";

import employees from "./employees";
import entities from "./entities";
import lots from "./lots";
import signin from "./signin";
import stuffs from "./stuffs";
import user from "./user";
import utils from "./utils";

const router = Router();
export default router;

router.use("/employees", employees);
router.use("/entities", entities);
router.use("/lots", lots);
router.use("/signin", signin);
router.use("/stuffs", stuffs);
router.use("/user", user);
router.use("/utils", utils);

/**
 * @apiDefine v100CommonErrors
 *
 * @apiError (Bad Request 400) {string="BAD_REQUEST"} code Код ошибки
 * @apiError (Bad Request 400) {string} message Подробное описание ошибки
 *
 * @apiError (Payload Too Large 413) {string="PAYLOAD_TOO_LARGE"} code Код ошибки
 * @apiError (Payload Too Large 413) {string} message Подробное описание ошибки
 *
 * @apiError (Internal Server Error 500) {string="INTERNAL_SERVER_ERROR"} code Код ошибки
 * @apiError (Internal Server Error 500) {string} message Подробное описание ошибки
 */
