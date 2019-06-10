import * as assert from "http-assert";
import {Op, WhereAttributeHash} from "sequelize";

import {ApiCodes} from "../apiCodes";
import {Entity, User} from "../models";

/**
 * Check fields for unique
 */
export class Unique {
  /**
   * @apiDefine v100UniqueCheckEmailAndPhone
   *
   * @apiError (Conflict 409 - Пользователь уже существует) {string="USER_FOUND_BY_EMAIL_AND_PHONE"} code
   * Код ошибки
   * @apiError (Conflict 409 - Пользователь уже существует) {string} message Подробное описание ошибки
   *
   * @apiError (Conflict 409 - Email уже существует) {string="USER_FOUND_BY_EMAIL"} code Код ошибки
   * @apiError (Conflict 409 - Email уже существует) {string} message Подробное описание ошибки
   *
   * @apiError (Conflict 409 - Телефон уже существует) {string="USER_FOUND_BY_PHONE"} code Код ошибки
   * @apiError (Conflict 409 - Телефон уже существует) {string} message Подробное описание ошибки
   */

  /**
   * Check email and phone for unique
   * @param email Email
   * @param phone Phone
   * @throws Error
   * @throws HttpError
   */
  public static async checkEmailAndPhone(
    email?: string,
    phone?: string,
  ): Promise<void> {
    if (!email && !phone) {
      return;
    }

    const users = await User.findAll({
      attributes: ["email", "phone"],
      where: {
        [Op.or]: ([
          email
            ? {
                email,
              }
            : undefined,
          phone
            ? {
                phone,
              }
            : undefined,
        ].filter((x) => x !== undefined) as unknown) as WhereAttributeHash[],
      },
    });
    assert(
      !users.some((user: User) => user.email === email && user.phone === phone),
      409,
      "user with same email and phone already exists",
      {code: ApiCodes.USER_FOUND_BY_EMAIL_AND_PHONE},
    );
    assert(
      !users.some((user: User) => user.email === email && user.phone !== phone),
      409,
      "user with same email already exists",
      {code: ApiCodes.USER_FOUND_BY_EMAIL},
    );
    assert(
      !users.some((user: User) => user.email !== email && user.phone === phone),
      409,
      "user with same phone already exists",
      {code: ApiCodes.USER_FOUND_BY_PHONE},
    );
  }

  /**
   * @apiDefine v100UniqueCheckItnAndPsrn
   *
   * @apiError (Conflict 409 - Юридическое лицо уже существует) {string="ENTITY_FOUND_BY_ITN_AND_PSRN"} code
   * Код ошибки
   * @apiError (Conflict 409 - Юридическое лицо уже существует) {string} message Подробное описание ошибки
   *
   * @apiError (Conflict 409 - ИНН уже существует) {string="ENTITY_FOUND_BY_ITN"} code Код ошибки
   * @apiError (Conflict 409 - ИНН уже существует) {string} message Подробное описание ошибки
   *
   * @apiError (Conflict 409 - ОГРН уже существует) {string="ENTITY_FOUND_BY_PSRN"} code Код ошибки
   * @apiError (Conflict 409 - ОГРН уже существует) {string} message Подробное описание ошибки
   */

  /**
   * Check ITN and PSRN for unique
   * @param itn Itn
   * @param psrn Psrn
   * @throws Error
   * @throws HttpError
   */
  public static async checkItnAndPsrn(
    itn: string,
    psrn: string,
  ): Promise<void> {
    const entities = await Entity.findAll({
      attributes: ["itn", "psrn"],
      where: {
        [Op.or]: [
          {
            itn,
          },
          {
            psrn,
          },
        ],
      },
    });
    assert(
      !entities.some(
        (entity: Entity) => entity.itn === itn && entity.psrn === psrn,
      ),
      409,
      "entity with same itn and psrn already exists",
      {code: ApiCodes.ENTITY_FOUND_BY_ITN_AND_PSRN},
    );
    assert(
      !entities.some(
        (entity: Entity) => entity.itn === itn && entity.psrn !== psrn,
      ),
      409,
      "entity with same itn already exists",
      {code: ApiCodes.ENTITY_FOUND_BY_ITN},
    );
    assert(
      !entities.some(
        (entity: Entity) => entity.itn !== itn && entity.psrn === psrn,
      ),
      409,
      "entity with same psrn already exists",
      {code: ApiCodes.ENTITY_FOUND_BY_PSRN},
    );
  }
}
