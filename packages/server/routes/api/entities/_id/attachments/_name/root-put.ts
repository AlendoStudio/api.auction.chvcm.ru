import Router from "express-promise-router";
import * as createError from "http-errors";

import {Env, S3} from "src";

import unverifyEntity from "./unverifyEntity";

const router = Router({
  mergeParams: true,
});
export default router;

/**
 * @api {put} /entities/:id/attachments/:name Загрузить вложение
 * @apiVersion 1.0.0
 * @apiName UploadAttachment
 * @apiGroup Entities
 * @apiPermission Юридическое лицо или модератор
 *
 * @apiDescription В теле запроса должны быть переданы сырые байты
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
  const key = S3.entityAttachment(req.params.id, req.params.name);

  req.on("aborted", () => {
    req.emit("error", createError(400, "request aborted by user"));
  });

  await S3.client
    .upload({
      Body: req,
      Bucket: Env.AWS_S3_BUCKET,
      Key: key,
    })
    .promise();

  const obj = await S3.client
    .headObject({
      Bucket: Env.AWS_S3_BUCKET,
      Key: key,
    })
    .promise();

  if ((obj.ContentLength as number) > Env.EXPRESS_BODY_LIMIT_RAW) {
    await S3.client
      .deleteObject({
        Bucket: Env.AWS_S3_BUCKET,
        Key: key,
      })
      .promise();
    throw createError(413, "request entity too large");
  }

  res.status(204).send();

  return "next";
}, unverifyEntity);
