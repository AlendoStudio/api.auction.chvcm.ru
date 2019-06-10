import Router from "express-promise-router";
import * as assert from "http-assert";

import {ApiCodes, Env, S3} from "src";

const router = Router({
  mergeParams: true,
});
export default router;

/**
 * @api {get} /entities/:id/attachments/:name Скачать вложение
 * @apiVersion 1.0.0
 * @apiName DownloadAttachment
 * @apiGroup Entities
 * @apiPermission Юридическое лицо или модератор
 *
 * @apiDescription В теле ответа будут переданы сырые байты через стрим
 *
 * @apiParam {string="1..9223372036854775807"} :id ID юридического лица
 * @apiParam {string} :name Имя вложения.
 * Разрешенные символы: кириллица, латиница, цифры, минус, нижнее подчеркивание, пробел (не может начинаться с пробела).
 * В конце имени обязательно должно быть хотя бы одно расширение, соостоящее из точки, латинских букв и цифр
 *
 * @apiError (Not Found 404 - Вложение не найдено) {string="ATTACHMENT_NOT_FOUND_BY_NAME"} code Код ошибки
 * @apiError (Not Found 404 - Вложение не найдено) {string} message Подробное описание ошибки
 *
 * @apiUse v100CommonErrors
 * @apiUse v100AuthViaAuthToken
 * @apiUse v100ApiEntitiesIdErrors
 */
router.use(async (req, res) => {
  try {
    await S3.client
      .headObject({
        Bucket: Env.AWS_S3_BUCKET,
        Key: S3.entityAttachment(req.params.id, req.params.name),
      })
      .promise();
  } catch (error) {
    assert(
      error.code !== "NotFound",
      404,
      "attachment with same name not found",
      {code: ApiCodes.ATTACHMENT_NOT_FOUND_BY_NAME},
    );
    throw error;
  }

  res.status(200).type("application/octet-stream");

  S3.client
    .getObject({
      Bucket: Env.AWS_S3_BUCKET,
      Key: S3.entityAttachment(req.params.id, req.params.name),
    })
    .createReadStream()
    .pipe(res);
});
