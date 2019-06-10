import * as path from "path";

import {celebrate} from "celebrate";
import Router from "express-promise-router";

import {Const, Env, Joi, S3} from "src";

const router = Router({
  mergeParams: true,
});
export default router;

/**
 * @api {get} /entities/:id/attachments Получить список вложенией
 * @apiVersion 1.0.0
 * @apiName ListAttachments
 * @apiGroup Entities
 * @apiPermission Юридическое лицо или модератор
 *
 * @apiDescription Результаты отсортированы по имени вложения в порядке возрастания
 * (сортировка производится путем сравнения названий как массива байт в кодировке UTF-8)
 *
 * @apiParam {string="1..9223372036854775807"} :id ID юридического лица
 * @apiParam {string="0..1000"} [limit='"1000"'] Лимит
 * @apiParam {string} [offset] Оффсет
 *
 * @apiSuccess {object[]} data Данные
 * @apiSuccess {string} attachments.name Имя вложения
 * @apiSuccess {number} attachments.size Размер вложения в байтах
 * @apiSuccess {object} meta Метаданные
 * @apiSuccess {string} meta.nextOffset Значение следующего `offset` (может быть `null`)
 *
 * @apiUse v100CommonErrors
 * @apiUse v100AuthViaAuthToken
 * @apiUse v100ApiEntitiesIdErrors
 */
router.use(
  celebrate({
    query: Joi.object({
      limit: Joi.number()
        .min(0)
        .max(Const.AWS_S3_LIMIT_LIMIT)
        .default(Const.AWS_S3_LIMIT_LIMIT),
      offset: Joi.string(),
    }),
  }),
  async (req, res) => {
    const prefix = S3.entityAttachments(req.params.id);
    const objects = await S3.client
      .listObjects({
        Bucket: Env.AWS_S3_BUCKET,
        Delimiter: path.posix.sep,
        Marker: req.query.offset,
        MaxKeys: req.query.limit,
        Prefix: prefix,
      })
      .promise();

    res.status(200).json({
      data: (objects.Contents || []).map((item) => ({
        name: String(item.Key).substring(prefix.length),
        size: item.Size,
      })),
      meta: {
        nextOffset: objects.NextMarker || null,
      },
    });
  },
);
