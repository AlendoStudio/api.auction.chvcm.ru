import {Request, Response} from "express";
import * as assert from "http-assert";

import {ApiCodes} from "../apiCodes";

/**
 * @apiDefine v100AccessLevelAdmin
 *
 * @apiError (Forbidden 403 - Требуется администратор) {string="REQUIRED_ADMIN"} code Код ошибки
 * @apiError (Forbidden 403 - Требуется администратор) {string} message Подробное описание ошибки
 */

/**
 * @apiDefine v100AccessLevelModerator
 *
 * @apiError (Forbidden 403 - Требуется модератор) {string="REQUIRED_MODERATOR"} code Код ошибки
 * @apiError (Forbidden 403 - Требуется модератор) {string} message Подробное описание ошибки
 */

/**
 * @apiDefine v100AccessLevelVerifiedEntity
 *
 * @apiError (Forbidden 403 - Требуется проверенное юридическое лицо) {string="REQUIRED_VERIFIED_ENTITY"} code Код ошибки
 * @apiError (Forbidden 403 - Требуется проверенное юридическое лицо) {string} message Подробное описание ошибки
 */

export function accessLevel(
  allowed: "admin" | "moderator" | "verifiedEntity",
): (req: Request, res: Response) => Promise<string> {
  return async (req, res) => {
    switch (allowed) {
      case "admin": {
        assert(req.employee && req.employee.admin, 403, "required admin", {
          code: ApiCodes.REQUIRED_ADMIN,
        });
        break;
      }
      case "moderator": {
        assert(
          req.employee && req.employee.moderator,
          403,
          "required moderator",
          {code: ApiCodes.REQUIRED_MODERATOR},
        );
        break;
      }
      case "verifiedEntity": {
        assert(
          req.entity && req.entity.verified,
          403,
          "required verified entity",
          {code: ApiCodes.REQUIRED_VERIFIED_ENTITY},
        );
        break;
      }
    }

    return "next";
  };
}
