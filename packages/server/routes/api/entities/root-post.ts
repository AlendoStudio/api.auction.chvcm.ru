import {celebrate} from "celebrate";
import Router from "express-promise-router";

import {
  Bcrypt,
  bodyParser,
  Const,
  EmailNotifications,
  Entity,
  Joi,
  Jwt,
  reCaptcha2,
  Unique,
} from "src";

const router = Router();
export default router;

/**
 * @api {post} /entities Создать новое юридическое лицо
 * @apiVersion 1.0.0
 * @apiName SignUp
 * @apiGroup Entities
 * @apiPermission Гость
 *
 * @apiParam {string} g-recaptcha-response Токен reCaptcha v2
 * @apiParam {string} ceo Директор
 * @apiParam {string} email Email
 * @apiParam {string} itn Идентификационный номер налогоплательщика
 * @apiParam {string="ISO 639-1 в нижнем регистре"} language Язык
 * @apiParam {string} name Название огранизации
 * @apiParam {string} password Пароль (учитываются только первые 72 символа)
 * @apiParam {string="+79xxxxxxxxx"} phone Телефон
 * @apiParam {string} psrn Основной государственный регистрационный номер
 *
 * @apiSuccess (Created 201) {string} token Токен авторизации
 *
 * @apiUse v100CommonErrors
 * @apiUse v100Recaptcha2
 * @apiUse v100UniqueCheckEmailAndPhone
 * @apiUse v100UniqueCheckItnAndPsrn
 */
router.use(
  bodyParser(),
  reCaptcha2,
  celebrate({
    body: Joi.object({
      ceo: Joi.string().required(),
      email: Joi.email().required(),
      itn: Joi.itn().required(),
      language: Joi.pgEnumLanguageCode().required(),
      name: Joi.string().required(),
      password: Joi.zxcvbn().required(),
      phone: Joi.phone().required(),
      psrn: Joi.psrn().required(),
    }).append({
      "g-recaptcha-response": Joi.any().strip(),
    }),
  }),
  async (req, res) => {
    await Unique.checkEmailAndPhone(req.body.email, req.body.phone);
    await Unique.checkItnAndPsrn(req.body.itn, req.body.psrn);

    const entity = await Entity.create({
      ceo: req.body.ceo,
      email: req.body.email,
      itn: req.body.itn,
      language: req.body.language,
      name: req.body.name,
      password: await Bcrypt.hash(req.body.password),
      phone: req.body.phone,
      psrn: req.body.psrn,
    });

    res.status(201).json({
      token: await Jwt.signUser({
        id: entity.id as string,
        type: Const.USER_TYPE_ENTITY,
      }),
    });

    await EmailNotifications.instance.signup(entity);
  },
);
