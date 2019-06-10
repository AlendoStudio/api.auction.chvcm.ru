import Router from "express-promise-router";
import {RecaptchaV2} from "express-recaptcha";
import {RecaptchaResponseV2} from "express-recaptcha/dist/interfaces";
import * as assert from "http-assert";

import {ApiCodes} from "../apiCodes";
import {Env} from "../env";

export const reCaptcha2 = Router();

/**
 * @apiDefine v100Recaptcha2
 *
 * @apiError (Unauthorized 401 - reCaptcha v2 запретила доступ) {string="RECAPTCHA_V2"} code Код ошибки
 * @apiError (Unauthorized 401 - reCaptcha v2 запретила доступ) {string} message Подробное описание ошибки
 */
reCaptcha2.use(
  new RecaptchaV2("site_key", Env.RECAPTCHA_SECRET, {
    checkremoteip: true,
  }).middleware.verify,
  async (req, res) => {
    assert(
      !(req.recaptcha as RecaptchaResponseV2).error,
      401,
      (req.recaptcha as RecaptchaResponseV2).error,
      {code: ApiCodes.RECAPTCHA_V2},
    );

    return "next";
  },
);
