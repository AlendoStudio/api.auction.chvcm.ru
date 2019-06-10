import Router from "express-promise-router";

import {StuffTranslation} from "src";

const router = Router({
  mergeParams: true,
});
export default router;

/**
 * @api {get} /stuffs/:id/translations Получить список переводов
 * @apiVersion 1.0.0
 * @apiName ListTranslations
 * @apiGroup Stuffs
 * @apiPermission Пользователь
 *
 * @apiDescription Результаты отсортированы в порядке возрастания языка перевода
 *
 * @apiParam {string="1..9223372036854775807"} :id ID материала
 *
 * @apiSuccess {object[]} data Данные
 * @apiSuccess {string="ISO 639-1 в нижнем регистре"} data.code Язык перевода
 * @apiSuccess {string} data.title Название материала
 * @apiSuccess {string} data.description Описание материала (может быть пустым)
 *
 * @apiUse v100CommonErrors
 * @apiUse v100AuthViaAuthToken
 * @apiUse v100ApiStuffsIdErrors
 */
router.use(async (req, res) => {
  const translations = await StuffTranslation.findAll({
    attributes: ["code", "description", "title"],
    order: [["code", "ASC"]],
    where: {
      stuffId: req.params.id,
    },
  });

  res.status(200).json({
    data: translations.map((translation) => ({
      code: translation.code,
      description: translation.description,
      title: translation.title,
    })),
  });
});
