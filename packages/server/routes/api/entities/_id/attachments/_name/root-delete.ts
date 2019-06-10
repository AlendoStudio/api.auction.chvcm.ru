import Router from "express-promise-router";

import {Env, S3} from "src";

import unverifyEntity from "./unverifyEntity";

const router = Router({
  mergeParams: true,
});
export default router;

/**
 * @api {delete} /entities/:id/attachments/:name Удалить вложение
 * @apiVersion 1.0.0
 * @apiName DeleteAttachment
 * @apiGroup Entities
 * @apiPermission Юридическое лицо или модератор
 *
 * @apiParam {string="1..9223372036854775807"} :id ID юридического лица
 * @apiParam {string} :name Имя вложения.
 * Разрешенные символы: кириллица, латиница, цифры, минус, нижнее подчеркивание, пробел (не может начинаться с пробела).
 * В конце имени обязательно должно быть хотя бы одно расширение, соостоящее из точки, латинских букв и цифр
 *
 * @apiUse v100CommonErrors
 * @apiUse v100AuthViaAuthToken
 * @apiUse v100ApiEntitiesIdErrors
 */
router.use(async (req, res) => {
  await S3.client
    .deleteObject({
      Bucket: Env.AWS_S3_BUCKET,
      Key: S3.entityAttachment(req.params.id, req.params.name),
    })
    .promise();

  res.status(204).send();

  return "next";
}, unverifyEntity);
