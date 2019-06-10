import {celebrate} from "celebrate";
import Router from "express-promise-router";

import {Employee, Joi} from "src";

const router = Router();
export default router;

/**
 * @api {get} /employees Получить список сотрудников
 * @apiVersion 1.0.0
 * @apiName ListEmployees
 * @apiGroup Employees
 * @apiPermission Администратор
 *
 * @apiDescription Результаты отсортированы по `name` в порядке возрастания
 *
 * @apiParam {string="0..100"} [limit='"100"'] Лимит
 * @apiParam {string="0..9223372036854775807"} [offset='"0"'] Оффсет
 *
 * @apiSuccess {object[]} data Данные
 * @apiSuccess {boolean} data.admin Есть ли права администратора?
 * @apiSuccess {boolean} data.banned Забанен ли сотрудник?
 * @apiSuccess {string} data.email Email
 * @apiSuccess {string="1..9223372036854775807"} data.id ID сотрудника
 * @apiSuccess {string="ISO 639-1 в нижнем регистре"} data.language Язык
 * @apiSuccess {boolean} data.moderator Есть ли права модератора?
 * @apiSuccess {string} data.name Имя
 * @apiSuccess {string} data.phone Телефон
 * @apiSuccess {string="ISO 8601"} data.registration Дата регистрации
 *
 * @apiUse v100CommonErrors
 * @apiUse v100AuthViaAuthToken
 * @apiUse v100AccessLevelAdmin
 */
router.use(
  celebrate({
    query: Joi.object({
      limit: Joi.pgLimit(),
      offset: Joi.pgOffset(),
    }),
  }),
  async (req, res) => {
    const employees = await Employee.findAll({
      attributes: [
        "admin",
        "banned",
        "email",
        "id",
        "language",
        "moderator",
        "name",
        "phone",
        "registration",
      ],
      limit: req.query.limit,
      offset: req.query.offset,
      order: [["name", "ASC"]],
    });

    res.status(200).json({
      data: employees.map((employee) => ({
        admin: employee.admin,
        banned: employee.banned,
        email: employee.email,
        id: employee.id,
        language: employee.language,
        moderator: employee.moderator,
        name: employee.name,
        phone: employee.phone,
        registration: employee.registration,
      })),
    });
  },
);
