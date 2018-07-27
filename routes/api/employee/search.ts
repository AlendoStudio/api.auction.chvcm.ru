import {
  BooleanUnit,
  ObjectUnit,
  PgBigSerialUnit,
  PgLimitUnit,
  PgOffsetUnit,
  RequestValidator,
} from "@alendo/express-req-validator";

import {Router} from "express";
import * as _ from "lodash";

import {IEmployeeInstance, Sequelize} from "src";

const router = Router();
export default router;

/**
 * @api {post} /employee/search Поиск по сотрудникам
 * @apiVersion 0.0.0
 * @apiName Search
 * @apiGroup Employee
 * @apiPermission Администратор
 *
 * @apiDescription Результаты отсортированы по ID в порядке возрастания
 *
 * @apiParam {boolean} [admin] Фильтр по администраторам
 * @apiParam {boolean} [banned] Фильтр по бану
 * @apiParam {string="1..9223372036854775807"} [id] Фильтр по ID сотрудника
 * @apiParam {string="0..9223372036854775807"} [limit] Лимит
 * @apiParam {boolean} [moderator] Фильтр по модераторам
 * @apiParam {string="0..9223372036854775807"} [offset] Оффсет
 *
 * @apiSuccess {object[]} employees Массив сотрудников
 * @apiSuccess {boolean} employees.admin Есть ли права администратора?
 * @apiSuccess {boolean} employees.banned Забанен ли сотрудник?
 * @apiSuccess {string} employees.email Email
 * @apiSuccess {string="1..9223372036854775807"} employees.id ID сотрудника
 * @apiSuccess {boolean} employees.moderator Есть ли права модератора?
 * @apiSuccess {string} employees.name Имя
 * @apiSuccess {string} employees.phone Телефон
 * @apiSuccess {string="ISO 8601"} employees.registration Дата регистрации
 *
 * @apiError (Bad Request 400 - Параметр равен null) {string="OBJECT_NULL_VALUE"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр равен null) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр admin, banned или moderator неверный) {string="WRONG_BOOLEAN"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр admin, banned или moderator неверный) {string} message
 * Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр id неверный) {string="WRONG_PG_BIGSERIAL"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр id неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр limit неверный) {string="WRONG_PG_LIMIT"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр limit неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр offset неверный) {string="WRONG_PG_OFFSET"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр offset неверный) {string} message Подробное описание ошибки
 *
 * @apiUse v000CommonHeaders
 * @apiUse v000AuthAuth
 * @apiUse v000AuthRequireAdmin
 */
router.post("/", new RequestValidator({
  body: {
    Unit: ObjectUnit,
    payload: {
      admin: {
        Unit: BooleanUnit,
        optional: true,
      },
      banned: {
        Unit: BooleanUnit,
        optional: true,
      },
      id: {
        Unit: PgBigSerialUnit,
        optional: true,
      },
      limit: {
        Unit: PgLimitUnit,
        optional: true,
      },
      moderator: {
        Unit: BooleanUnit,
        optional: true,
      },
      offset: {
        Unit: PgOffsetUnit,
        optional: true,
      },
    },
  },
}).middleware, async (req, res) => {
  let result: IEmployeeInstance[] = [];
  await res.achain
    .action(async () => {
      result = await Sequelize.instance.employee.findAll(_.pickBy({
        attributes: ["admin", "banned", "email", "id", "moderator", "name", "phone", "registration"],
        limit: req.body.value.limit ? req.body.value.limit.value : undefined,
        offset: req.body.value.offset ? req.body.value.offset.value : undefined,
        order: [
          ["id", "ASC"],
        ],
        where: _.pickBy({
          admin: req.body.value.admin ? req.body.value.admin.value : undefined,
          banned: req.body.value.banned ? req.body.value.banned.value : undefined,
          id: req.body.value.id ? req.body.value.id.value : undefined,
          moderator: req.body.value.moderator ? req.body.value.moderator.value : undefined,
        }, (v) => v !== undefined),
      }));
    })
    .json(() => {
      return {
        employees: result.map((employee) => {
          return {
            admin: employee.admin,
            banned: employee.banned,
            email: employee.email,
            id: employee.id,
            moderator: employee.moderator,
            name: employee.name,
            phone: employee.phone,
            registration: employee.registration,
          };
        }),
      };
    })
    .execute();
});
