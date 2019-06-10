import {celebrate} from "celebrate";
import Router from "express-promise-router";
import * as _ from "lodash";

import {
  Bcrypt,
  bodyParser,
  EmailNotifications,
  Joi,
  Sequelize,
  TokenTfaOtp,
  TokenTfaRecovery,
  Unique,
  User,
} from "src";

const router = Router();
export default router;

/**
 * @api {patch} /user Изменить самого себя
 * @apiVersion 1.0.0
 * @apiName ChangeYourself
 * @apiGroup User
 * @apiPermission Пользователь
 *
 * @apiDescription > Хочешь изменить мир - начни с себя
 *
 * @apiParam {string} [email] Email
 * @apiParam {string="ISO 639-1 в нижнем регистре"} [language] Язык
 * @apiParam {string} [name] Имя (только для сотрудников)
 * @apiParam {string} [password] Пароль (учитываются только первые 72 символа)
 * @apiParam {string="+79xxxxxxxxx"} [phone] Телефон
 * @apiParam {boolean} [tfa] Включена ли двухэтапная аутентификация?
 *
 * @apiUse v100CommonErrors
 * @apiUse v100AuthViaAuthToken
 * @apiUse v100UniqueCheckEmailAndPhone
 */
router.use(
  bodyParser(),
  celebrate({
    body: Joi.object({
      email: Joi.email(),
      language: Joi.pgEnumLanguageCode(),
      name: Joi.string(),
      password: Joi.zxcvbn(),
      phone: Joi.phone(),
      tfa: Joi.boolean(),
    }),
  }),
  async (req, res) => {
    if (req.entity) {
      delete req.body.name;
    }

    await Unique.checkEmailAndPhone(req.body.email, req.body.phone);

    if (req.body.password) {
      req.body.password = await Bcrypt.hash(req.body.password);
    }

    await Sequelize.instance.transaction(async () => {
      await User.update(
        {
          email: req.body.email,
          language: req.body.language,
          name: req.body.name,
          password: req.body.password,
          phone: req.body.phone,
          tfa: req.body.tfa,
        },
        {
          where: {
            id: req.user.id as string,
          },
        },
      );
      if (req.body.tfa === false) {
        await TokenTfaOtp.destroy({
          where: {
            userId: req.user.id as string,
          },
        });
        await TokenTfaRecovery.destroy({
          where: {
            userId: req.user.id as string,
          },
        });
      }
    });

    res.status(204).send();

    if (req.body.password) {
      await EmailNotifications.instance.passwordResetComplete({
        email: req.body.email || req.user.email,
        language: req.body.language || req.user.language,
        name: req.body.name || req.user.name,
      });
    }
  },
);
