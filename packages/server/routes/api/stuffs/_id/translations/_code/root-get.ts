import Router from "express-promise-router";
import * as assert from "http-assert";

import {ApiCodes, StuffTranslation} from "src";

const router = Router({
  mergeParams: true,
});
export default router;

/**
 * @api {get} /stuffs/:id/translations/:code Получить перевод
 * @apiVersion 1.0.0
 * @apiName GetTranslation
 * @apiGroup Stuffs
 * @apiPermission Пользователь
 *
 * @apiParam {string="1..9223372036854775807"} :id ID материала
 * @apiParam {string="ISO 639-1 в нижнем регистре"} :code Язык перевода
 *
 * @apiSuccess {object} data Данные
 * @apiSuccess {string="ISO 639-1 в нижнем регистре"} data.code Язык перевода
 * @apiSuccess {string} data.title Название материала
 * @apiSuccess {string} data.description Описание материала (может быть пустым)
 *
 * @apiError (Not Found 404 - Перевод не найден) {string="STUFF_TRANSLATION_NOT_FOUND_BY_CODE"} code Код ошибки
 * @apiError (Not Found 404 - Перевод не найден) {string} message Подробное описание ошибки
 *
 * @apiUse v100CommonErrors
 * @apiUse v100AuthViaAuthToken
 * @apiUse v100ApiStuffsIdErrors
 */
router.use(async (req, res) => {
  const translation = (await StuffTranslation.findOne({
    attributes: ["code", "description", "title"],
    where: {
      code: req.params.code,
      stuffId: req.params.id,
    },
  })) as StuffTranslation;
  assert(translation, 404, "stuff translation with same code not found", {
    code: ApiCodes.STUFF_TRANSLATION_NOT_FOUND_BY_CODE,
  });

  res.status(200).json({
    data: {
      code: translation.code,
      description: translation.description,
      title: translation.title,
    },
  });
});
