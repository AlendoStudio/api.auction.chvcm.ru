// tslint:disable no-reference
/// <reference path="../../types/index.d.ts" />

import {Recaptcha2 as SuperRecaptcha2} from "@alendo/recaptcha";

import {NextFunction, Request, Response} from "express";

import {ApiCodes} from "../apiCodes";
import {Env} from "../env";

/**
 * reCAPTCHA v2
 */
export class Recaptcha2 extends SuperRecaptcha2 {
  /**
   * Instance
   * @return {Recaptcha2}
   */
  public static get instance(): Recaptcha2 {
    if (!this._instance) {
      this._instance = new Recaptcha2();
    }
    return this._instance;
  }

  private static _instance: Recaptcha2;

  private constructor() {
    super(Env.RECAPTCHA_SECRET);
  }

  /**
   * @apiDefine v000Recaptcha2
   *
   * @apiError (Unauthorized 401 - reCAPTCHA запретила доступ) {string="WRONG_RECAPTCHA"} code Код ошибки
   * @apiError (Unauthorized 401 - reCAPTCHA запретила доступ) {string} message Подробное описание ошибки
   */

  /**
   * Middleware for Express
   * @param {e.Request} req Request
   * @param {e.Response} res Response
   * @param {e.NextFunction} next Next function
   * @return {Promise<void>}
   */
  public async middleware(req: Request, res: Response, next: NextFunction) {
    if (Env.RECAPTCHA_SECRET === "disable") {
      next();
      return;
    }
    await res.achain
      .action(async () => {
        await super.middleware(req, res);
      })
      .action(() => {
        if (req.recaptcha2.error) {
          throw req.recaptcha2.error;
        }
      })
      .check(() => {
        return !!req.recaptcha2.response && req.recaptcha2.response.success;
      }, ApiCodes.WRONG_RECAPTCHA, () => {
        return req.recaptcha2.response && req.recaptcha2.response.errorCodes.length !== 0 ?
          JSON.stringify(req.recaptcha2.response.errorCodes) : "FUCK YOU BOT!";
      }, 401)
      .execute(next);
  }
}
