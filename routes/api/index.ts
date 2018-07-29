import {Router} from "express";

const router = Router();
export default router;

import attachment from "./attachment/index";
import employee from "./employee/index";
import entity from "./entity/index";
import lot from "./lot/index";
import password from "./password/index";
import stuff from "./stuff/index";
import tfa from "./tfa/index";
import user from "./user/index";

import ping from "./ping";
import signin from "./signin";
import signup from "./signup";

router.use("/attachment", attachment);
router.use("/employee", employee);
router.use("/entity", entity);
router.use("/lot", lot);
router.use("/password", password);
router.use("/stuff", stuff);
router.use("/tfa", tfa);
router.use("/user", user);

router.use("/ping", ping);
router.use("/signin", signin);
router.use("/signup", signup);

/**
 * @apiDefine v000CommonHeaders
 * @apiHeader (Accept-Encoding) {string="gzip", "deflate", "identity"} [Accept-Encoding]
 * Перечень поддерживаемых способов кодирования содержимого сущности при передаче
 *
 * @apiHeader (Content-Type запроса) {string="application/json"} [Content-Type]
 * Формат и способ представления сущности
 *
 * @apiHeader (Content-Type ответа) {string="application/json"} [Content-Type]
 * Формат и способ представления сущности
 *
 * @apiHeader (Content-Encoding) {string="gzip", "deflate", "identity"} [Content-Encoding]
 * Способ кодирования содержимого сущности при передаче
 *
 * @apiHeader (Origin) {string} [Origin]
 * Инициализировать получение прав на совместное использование ресурсов между разными источниками
 *
 * @apiError (Payload Too Large 413) {string="PAYLOAD_TOO_LARGE_ERROR"} code Код ошибки
 * @apiError (Payload Too Large 413) {string} message Подробное описание ошибки
 *
 * @apiError (Internal Server Error 500) {string="INTERNAL_SERVER_ERROR"} code Код ошибки
 * @apiError (Internal Server Error 500) {string} message Подробное описание ошибки
 */
