import Router from "express-promise-router";
import * as assert from "http-assert";

import {ApiCodes, Employee} from "src";

const router = Router({
  mergeParams: true,
});
export default router;

/**
 * @api {get} /employees/:id Получить сотрудника
 * @apiVersion 1.0.0
 * @apiName GetEmployee
 * @apiGroup Employees
 * @apiPermission Администратор
 *
 * @apiParam {string="1..9223372036854775807"} :id ID сотрудника
 *
 * @apiSuccess {object} data Данные
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
 * @apiError (Not Found 404 - Сотрудник не найден) {string="EMPLOYEE_NOT_FOUND_BY_ID"} code Код ошибки
 * @apiError (Not Found 404 - Сотрудник не найден) {string} message Подробное описание ошибки
 *
 * @apiUse v100CommonErrors
 * @apiUse v100AuthViaAuthToken
 * @apiUse v100AccessLevelAdmin
 */
router.use(async (req, res) => {
  const employee = (await Employee.findByPk(req.params.id, {
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
  })) as Employee;
  assert(employee, 404, "employee with same id not found", {
    code: ApiCodes.EMPLOYEE_NOT_FOUND_BY_ID,
  });

  res.status(200).json({
    data: {
      admin: employee.admin,
      banned: employee.banned,
      email: employee.email,
      id: employee.id,
      language: employee.language,
      moderator: employee.moderator,
      name: employee.name,
      phone: employee.phone,
      registration: employee.registration,
    },
  });
});
