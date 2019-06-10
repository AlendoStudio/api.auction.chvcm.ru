import * as bearerToken from "express-bearer-token";
import Router from "express-promise-router";
import * as assert from "http-assert";
import * as createError from "http-errors";

import {ApiCodes} from "../apiCodes";
import {Const} from "../const";
import {Employee, Entity} from "../models";
import {Jwt} from "../utils";

export const authViaAuthToken = Router();

/**
 * @apiDefine v100AuthViaAuthToken
 *
 * @apiHeader (Authorization) {string} Authorization **Bearer** токен авторизации
 *
 * @apiError (Unauthorized 401 - Неверный токен авторизаци) {string="JWT_VERIFY_USER"} code Код ошибки
 * @apiError (Unauthorized 401 - Неверный токен авторизаци) {string} message Подробное описание ошибки
 *
 * @apiError (Unauthorized 401 - Сотрудник не найден) {string="EMPLOYEE_NOT_FOUND_BY_ID"} code Код ошибки
 * @apiError (Unauthorized 401 - Сотрудник не найден) {string} message Подробное описание ошибки
 *
 * @apiError (Unauthorized 401 - Юридическое лицо не найдено) {string="ENTITY_NOT_FOUND_BY_ID"} code Код ошибки
 * @apiError (Unauthorized 401 - Юридическое лицо не найдено) {string} message Подробное описание ошибки
 *
 * @apiError (Unauthorized 401 - Пользователь забанен) {string="BANNED"} code Код ошибки
 * @apiError (Unauthorized 401 - Пользователь забанен) {string} message Подробное описание ошибки
 */
authViaAuthToken.use(bearerToken(), async (req, res) => {
  let verifiedUser;
  try {
    verifiedUser = await Jwt.verifyUser(req.token as string);
  } catch (error) {
    throw createError(401, error.message, {code: ApiCodes.JWT_VERIFY_USER});
  }

  switch (verifiedUser.type) {
    case Const.USER_TYPE_EMPLOYEE: {
      const employee = (await Employee.findByPk(verifiedUser.id, {
        attributes: [
          "admin",
          "banned",
          "email",
          "id",
          "language",
          "moderator",
          "name",
        ],
      })) as Employee;
      assert(employee, 401, "employee with same id not found", {
        code: ApiCodes.EMPLOYEE_NOT_FOUND_BY_ID,
      });
      req.employee = employee.toJSON();
      break;
    }
    case Const.USER_TYPE_ENTITY: {
      const entity = (await Entity.findByPk(verifiedUser.id, {
        attributes: [
          "banned",
          "ceo",
          "email",
          "id",
          "language",
          "name",
          "verified",
        ],
      })) as Entity;
      assert(entity, 401, "entity with same id not found", {
        code: ApiCodes.ENTITY_NOT_FOUND_BY_ID,
      });
      req.entity = entity.toJSON();
      break;
    }
  }

  req.user = {...(req.employee || req.entity), type: verifiedUser.type};
  assert(!req.user.banned, 401, "user was banned", {code: ApiCodes.BANNED});

  return "next";
});
