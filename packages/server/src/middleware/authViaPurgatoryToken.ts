import * as bearerToken from "express-bearer-token";
import Router from "express-promise-router";
import * as assert from "http-assert";
import {Op} from "sequelize";

import {ApiCodes} from "../apiCodes";
import {TokenTfaPurgatory, User} from "../models";

export const authViaPurgatoryToken = Router();

/**
 * @apiDefine v100AuthViaPurgatoryToken
 *
 * @apiHeader (Authorization Header) {string} Authorization **Bearer** временный токен авторизации
 *
 * @apiError (Unauthorized 401 - Пользователь не найден) {string="USER_NOT_FOUND_BY_PURGATORY_TOKEN"} code Код ошибки
 * @apiError (Unauthorized 401 - Пользователь не найден) {string} message Подробное описание ошибки
 *
 * @apiError (Unauthorized 401 - Пользователь забанен) {string="BANNED"} code Код ошибки
 * @apiError (Unauthorized 401 - Пользователь забанен) {string} message Подробное описание ошибки
 */
authViaPurgatoryToken.use(bearerToken(), async (req, res) => {
  req.user = (req.token
    ? await User.findOne({
        attributes: [
          "banned",
          "email",
          "id",
          "language",
          "name",
          "tfa",
          "type",
        ],
        include: [
          {
            attributes: [],
            model: TokenTfaPurgatory,
            where: {
              expires: {
                [Op.gt]: new Date(),
              },
              token: req.token,
            },
          },
        ],
      })
    : null) as User;
  assert(req.user, 401, "user not found by purgatory token", {
    code: ApiCodes.USER_NOT_FOUND_BY_PURGATORY_TOKEN,
  });
  assert(!req.user.banned, 401, "user was banned", {code: ApiCodes.BANNED});

  return "next";
});
