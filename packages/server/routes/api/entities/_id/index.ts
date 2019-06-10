import {celebrate} from "celebrate";
import Router from "express-promise-router";
import * as assert from "http-assert";

import {ApiCodes, authViaAuthToken, Entity, Joi} from "src";

import attachments from "./attachments";
import $getRoot from "./root-get";
import $patchRoot from "./root-patch";

const router = Router({
  mergeParams: true,
});
export default router;

router.use(
  authViaAuthToken,
  celebrate({
    params: Joi.object({
      id: Joi.pgBigSerial().required(),
    }),
  }),
  async (req, res) => {
    assert(
      (req.entity && req.entity.id === req.params.id) ||
        (req.employee && req.employee.moderator),
      403,
      "required entity with same id or moderator",
      {code: ApiCodes.REQUIRED_SAME_ENTITY_OR_MODERATOR},
    );

    if (!req.entity) {
      const entity = (await Entity.findByPk(req.params.id, {
        attributes: [
          "banned",
          "ceo",
          "email",
          "id",
          "language",
          "name",
          "verified",
        ],
      })) as Entity;
      assert(entity, 404, "entity with same id not found", {
        code: ApiCodes.ENTITY_NOT_FOUND_BY_ID,
      });

      req.entity = entity.toJSON();
    }

    return "next";
  },
);

router.use("/attachments", attachments);
router.get("/", $getRoot);
router.patch("/", $patchRoot);

/**
 * @apiDefine v100ApiEntitiesIdErrors
 *
 * @apiError (Forbidden 403 - Требуется юридическое лицо или модератор) {string="REQUIRED_SAME_ENTITY_OR_MODERATOR"} code Код ошибки
 * @apiError (Forbidden 403 - Требуется юридическое лицо или модератор) {string} message Подробное описание ошибки
 *
 * @apiError (Not Found 404 - Юридическое лицо не найдено) {string="ENTITY_NOT_FOUND_BY_ID"} code Код ошибки
 * @apiError (Not Found 404 - Юридическое лицо не найдено) {string} message Подробное описание ошибки
 */
