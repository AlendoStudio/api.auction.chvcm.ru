import {Router} from "express";

import {Const} from "src";

const router = Router();
export default router;

/**
 * @api {get} /user Получить информацию о самом себе
 * @apiVersion 0.0.0
 * @apiName InfoAboutYourself
 * @apiGroup User
 * @apiPermission Пользователь
 *
 * @apiSuccess (Success 200 - Для сотрудника) {boolean} admin Есть ли права администратора?
 * @apiSuccess (Success 200 - Для сотрудника) {string} email Email
 * @apiSuccess (Success 200 - Для сотрудника) {string="1..9223372036854775807"} id ID
 * @apiSuccess (Success 200 - Для сотрудника) {string="ISO 639-1 в нижнем регистре"} language Язык
 * @apiSuccess (Success 200 - Для сотрудника) {boolean} moderator Есть ли права модератора?
 * @apiSuccess (Success 200 - Для сотрудника) {string} name Имя
 * @apiSuccess (Success 200 - Для сотрудника) {string} phone Телефон
 * @apiSuccess (Success 200 - Для сотрудника) {string="ISO 8601"} registration Дата регистрации
 * @apiSuccess (Success 200 - Для сотрудника) {boolean} tfa Включена ли двухэтапная аутентификация?
 * @apiSuccess (Success 200 - Для сотрудника) {string="employee"} type Тип пользователя
 *
 * @apiSuccess (Success 200 - Для юридического лица) {string} ceo Директор
 * @apiSuccess (Success 200 - Для юридического лица) {string} email Email
 * @apiSuccess (Success 200 - Для юридического лица) {string="1..9223372036854775807"} id ID
 * @apiSuccess (Success 200 - Для юридического лица) {string} itn Идентификационный номер налогоплательщика
 * @apiSuccess (Success 200 - Для юридического лица) {string="ISO 639-1 в нижнем регистре"} language Язык
 * @apiSuccess (Success 200 - Для юридического лица) {string} name Название огранизации
 * @apiSuccess (Success 200 - Для юридического лица) {string} phone Телефон
 * @apiSuccess (Success 200 - Для юридического лица) {string} psrn Основной государственный регистрационный номер
 * @apiSuccess (Success 200 - Для юридического лица) {string="ISO 8601"} registration Дата регистрации
 * @apiSuccess (Success 200 - Для юридического лица) {boolean} tfa Включена ли двухэтапная аутентификация?
 * @apiSuccess (Success 200 - Для юридического лица) {string="entity"} type Тип пользователя
 * @apiSuccess (Success 200 - Для юридического лица) {boolean} verified Является ли учетная запись проверенной?
 *
 * @apiUse v000CommonHeaders
 * @apiUse v000AuthAuth
 */
router.get("/", async (req, res) => {
  await res.achain
    .checkout(() => {
      return req.user.type as string;
    })
    .fork(Const.USER_TYPE_EMPLOYEE)
    .json(() => {
      return {
        admin: req.employee.admin,
        email: req.employee.email,
        id: req.employee.id,
        language: req.employee.language,
        moderator: req.employee.moderator,
        name: req.employee.name,
        phone: req.employee.phone,
        registration: req.employee.registration,
        tfa: req.employee.tfa,
        type: req.user.type,
      };
    })
    .fork(Const.USER_TYPE_ENTITY)
    .json(() => {
      return {
        ceo: req.entity.ceo,
        email: req.entity.email,
        id: req.entity.id,
        itn: req.entity.itn,
        language: req.entity.language,
        name: req.entity.name,
        phone: req.entity.phone,
        psrn: req.entity.psrn,
        registration: req.entity.registration,
        tfa: req.entity.tfa,
        type: req.user.type,
        verified: req.entity.verified,
      };
    })
    .execute();
});
