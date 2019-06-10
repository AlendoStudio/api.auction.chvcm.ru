import {celebrate} from "celebrate";
import Router from "express-promise-router";

import {bodyParser, EmailNotifications, Employee, Joi, Unique} from "src";

const router = Router();
export default router;

/**
 * @api {post} /employees Создать нового сотрудника
 * @apiVersion 1.0.0
 * @apiName InviteEmployee
 * @apiGroup Employees
 * @apiPermission Администратор
 *
 * @apiParam {string} email Email
 * @apiParam {string="ISO 639-1 в нижнем регистре"} language Язык
 * @apiParam {string} name Имя
 * @apiParam {string="+79xxxxxxxxx"} phone Телефон
 *
 * @apiSuccess (Created 201) {string="1..9223372036854775807"} id ID сотрудника
 *
 * @apiUse v100CommonErrors
 * @apiUse v100AuthViaAuthToken
 * @apiUse v100AccessLevelAdmin
 * @apiUse v100UniqueCheckEmailAndPhone
 */
router.use(
  bodyParser(),
  celebrate({
    body: Joi.object({
      email: Joi.email().required(),
      language: Joi.pgEnumLanguageCode().required(),
      name: Joi.string().required(),
      phone: Joi.phone().required(),
    }),
  }),
  async (req, res) => {
    await Unique.checkEmailAndPhone(req.body.email, req.body.phone);

    const employee = await Employee.create({
      email: req.body.email,
      language: req.body.language,
      name: req.body.name,
      phone: req.body.phone,
    });

    res.status(201).json({
      id: employee.id,
    });

    await EmailNotifications.instance.inviteEmployee(employee);
  },
);
