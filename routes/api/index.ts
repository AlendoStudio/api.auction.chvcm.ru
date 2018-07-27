import * as cors from "cors";
import {Router} from "express";

const router = Router();
export default router;

import {Env} from "src";

// noinspection JSUnusedGlobalSymbols
router.use(cors({
  origin(origin, callback) {
    callback(null, Env.CORS_WHITELIST.length === 0 || Env.CORS_WHITELIST.indexOf(origin) !== -1);
  },
}));

import attachment from "./attachment/index";
import employee from "./employee/index";
import entity from "./entity/index";
import lot from "./lot/index";
import password from "./password/index";
import stuff from "./stuff/index";
import tfa from "./tfa/index";
import user from "./user/index";

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

router.use("/signin", signin);
router.use("/signup", signup);

/**
 * @apiDefine v000CommonHeaders
 * @apiHeader (Accept-Encoding) {string="gzip", "deflate", "identity"} [Accept-Encoding]
 * Перечень поддерживаемых способов кодирования содержимого сущности при передаче
 *
 * @apiHeader (Content-Type) {string="application/json"} [Content-Type]
 * Формат и способ представления сущности
 *
 * @apiHeader (Content-Encoding) {string="gzip", "deflate", "identity"} [Content-Encoding]
 * Способ кодирования содержимого сущности при передаче
 *
 * @apiHeader (Origin) {string} [Origin]
 * Инициализировать получение прав на совместное использование ресурсов между разными источниками
 *
 * @apiError (Internal Server Error 500) {string="INTERNAL_SERVER_ERROR"} code Код ошибки
 * @apiError (Internal Server Error 500) {string} message Подробное описание ошибки
 */
