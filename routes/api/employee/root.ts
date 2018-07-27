import {
  BooleanUnit,
  EmailUnit,
  NotEmptyStringUnit,
  ObjectUnit,
  PgBigSerialUnit,
  PgEnumUnit,
  PgEnumUnitCacheMemory,
  PgEnumUnitClient,
  PhoneUnit,
  RequestValidator,
} from "@alendo/express-req-validator";

import {Router} from "express";
import * as _ from "lodash";

import {
  ApiCodes,
  EmailNotifications,
  IEmployeeInstance,
  Sequelize,
  Unique,
} from "src";

const router = Router();
export default router;

/**
 * @api {post} /employee Зарегистрировать сотрудника и отправить ему пригласительный email
 * @apiVersion 0.0.0
 * @apiName Invite
 * @apiGroup Employee
 * @apiPermission Администратор
 *
 * @apiParam {string} email Email
 * @apiParam {string="ISO 639-1 в нижнем регистре"} language Язык
 * @apiParam {string} name Имя
 * @apiParam {string} phone Телефон
 *
 * @apiSuccess {string="1..9223372036854775807"} id ID сотрудника
 *
 * @apiError (Bad Request 400 - Пропущен параметр) {string="OBJECT_MISSING_KEY"} code Код ошибки
 * @apiError (Bad Request 400 - Пропущен параметр) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр равен null) {string="OBJECT_NULL_VALUE"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр равен null) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр email неверный) {string="WRONG_EMAIL"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр email неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр language неверный) {string="WRONG_PG_ENUM"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр language неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр name неверный) {string="WRONG_NOT_EMPTY_STRING"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр name неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр phone неверный) {string="WRONG_PHONE"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр phone неверный) {string} message Подробное описание ошибки
 *
 * @apiUse v000CommonHeaders
 * @apiUse v000AuthAuth
 * @apiUse v000AuthRequireAdmin
 * @apiUse v000UniqueCheckEmailAndPhone
 */
router.post("/", new RequestValidator({
  body: {
    Unit: ObjectUnit,
    payload: {
      [ObjectUnit.FILTER]: true,
      email: {
        Unit: EmailUnit,
      },
      language: {
        Unit: PgEnumUnit,
        payload: {
          cache: PgEnumUnitCacheMemory,
          client: PgEnumUnitClient,
          enumName: "LANGUAGE_CODE",
        },
      },
      name: {
        Unit: NotEmptyStringUnit,
      },
      phone: {
        Unit: PhoneUnit,
        payload: {
          locale: "any",
          strictMode: true,
        },
      },
    },
  },
}).middleware, Unique.checkEmailAndPhoneMiddleware((req) => {
  return {
    email: req.body.value.email.value,
    phone: req.body.value.phone.value,
  };
}), async (req, res) => {
  let employee: IEmployeeInstance;
  await res.achain
    .action(async () => {
      await Sequelize.instance.transaction(async () => {
        employee = await Sequelize.instance.employee.create((req.body as ObjectUnit).mappedValues, {
          returning: true,
        });
        await EmailNotifications.instance.inviteEmployee(employee);
      });
    })
    .json(() => {
      return {
        id: employee.id,
      };
    })
    .execute();
});

/**
 * @api {post} /employee/:id Изменить сотрудника
 * @apiVersion 0.0.0
 * @apiName Update
 * @apiGroup Employee
 * @apiPermission Администратор
 *
 * @apiParam {string="1..9223372036854775807"} :id ID сотрудника
 * @apiParam {boolean} [banned] Забанен ли сотрудник?
 * @apiParam {boolean} [admin] Есть ли права администратора?
 * @apiParam {boolean} [moderator] Есть ли права модератора?
 *
 * @apiError (Bad Request 400 - Параметр равен null) {string="OBJECT_NULL_VALUE"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр равен null) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр :id неверный) {string="WRONG_PG_BIGSERIAL"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр :id неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр admin, banned или moderator неверный) {string="WRONG_BOOLEAN"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр admin, banned или moderator неверный) {string} message
 * Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Сотрудник не найден) {string="DB_EMPLOYEE_NOT_FOUND_BY_ID"} code Код ошибки
 * @apiError (Bad Request 400 - Сотрудник не найден) {string} message Подробное описание ошибки
 *
 * @apiUse v000CommonHeaders
 * @apiUse v000AuthAuth
 * @apiUse v000AuthRequireAdmin
 */
router.post("/:id", new RequestValidator({
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
      moderator: {
        Unit: BooleanUnit,
        optional: true,
      },
    },
  },
  params: {
    Unit: ObjectUnit,
    payload: {
      id: {
        Unit: PgBigSerialUnit,
      },
    },
  },
}).middleware, async (req, res) => {
  let employee: IEmployeeInstance | null = null;
  await res.achain
    .action(async () => {
      employee = await Sequelize.instance.employee.findById(req.params.value.id.value);
    })
    .check(() => {
      return !!employee;
    }, ApiCodes.DB_EMPLOYEE_NOT_FOUND_BY_ID, "employee with same id not found", 400)
    .action(async () => {
      await Sequelize.instance.transaction(async () => {
        await Sequelize.instance.employee.update(_.pickBy({
          admin: req.body.value.admin ? req.body.value.admin.value : undefined,
          banned: req.body.value.banned ? req.body.value.banned.value : undefined,
          moderator: req.body.value.moderator ? req.body.value.moderator.value : undefined,
        }, (v) => v !== undefined), {
          where: {
            id: req.params.value.id.value,
          },
        });
        if (req.body.value.banned && req.body.value.banned.value !== (employee as IEmployeeInstance).banned) {
          if (req.body.value.banned.value) {
            await EmailNotifications.instance.banned(employee as IEmployeeInstance);
          } else {
            await EmailNotifications.instance.unbanned(employee as IEmployeeInstance);
          }
        }
      });
    })
    .send204()
    .execute();
});
