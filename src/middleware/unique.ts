import {NextFunction, Request, Response} from "express";

import {ApiCodes} from "../apiCodes";
import {Sequelize} from "../pg";

/**
 * Unique middleware collection
 */
export class Unique {
  /**
   * Check email and phone for unique
   * @param {string} email Email
   * @param {string} phone Phone
   * @return {Promise}
   * @throws Error
   */
  public static async checkEmailAndPhone(email: string, phone: string): Promise<{
    email: boolean,
    phone: boolean,
  }> {
    const users = await Sequelize.instance.user.findAll({
      attributes: ["email", "phone"],
      where: {
        [Sequelize.op.or]: [
          {
            email,
          }, {
            phone,
          },
        ],
      },
    });
    return {
      email: users.some((user) => user.email === email),
      phone: users.some((user) => user.phone === phone),
    };
  }

  /**
   * Check ITN and PSRN for unique
   * @param {string} itn ITN
   * @param {string} psrn PSRN
   * @return {Promise}
   * @throws Error
   */
  public static async checkItnAndPsrn(itn: string, psrn: string): Promise<{
    itn: boolean,
    psrn: boolean,
  }> {
    const entities = await Sequelize.instance.entity.findAll({
      attributes: ["itn", "psrn"],
      where: {
        [Sequelize.op.or]: [
          {
            itn,
          }, {
            psrn,
          },
        ],
      },
    });
    return {
      itn: entities.some((entity) => entity.itn === itn),
      psrn: entities.some((entity) => entity.psrn === psrn),
    };
  }

  /**
   * @apiDefine v000UniqueCheckEmailAndPhone
   *
   * @apiError (Bad Request 400 - Пользователь уже существует) {string="DB_USER_FOUND_BY_EMAIL_AND_PHONE"} code
   * Код ошибки
   * @apiError (Bad Request 400 - Пользователь уже существует) {string} message Подробное описание ошибки
   *
   * @apiError (Bad Request 400 - Email уже существует) {string="DB_USER_FOUND_BY_EMAIL"} code Код ошибки
   * @apiError (Bad Request 400 - Email уже существует) {string} message Подробное описание ошибки
   *
   * @apiError (Bad Request 400 - Телефон уже существует) {string="DB_USER_FOUND_BY_PHONE"} code Код ошибки
   * @apiError (Bad Request 400 - Телефон уже существует) {string} message Подробное описание ошибки
   */

  /**
   * Check email and phone for unique middleware
   * @param getEmailAndPhone Get email and phone
   */
  public static checkEmailAndPhoneMiddleware(getEmailAndPhone: (req: Request) => { email: string, phone: string }) {
    return async (req: Request, res: Response, next: NextFunction) => {
      let checkResult: {
        email: boolean,
        phone: boolean,
      };
      await res.achain
        .action(async () => {
          const {email, phone} = getEmailAndPhone(req);
          checkResult = await Unique.checkEmailAndPhone(email, phone);
        })
        .check(() => {
          return !(checkResult.email && checkResult.phone);
        }, ApiCodes.DB_USER_FOUND_BY_EMAIL_AND_PHONE, "user with same email and phone already exists", 400)
        .check(() => {
          return !(checkResult.email && !checkResult.phone);
        }, ApiCodes.DB_USER_FOUND_BY_EMAIL, "user with same email already exists", 400)
        .check(() => {
          return !(!checkResult.email && checkResult.phone);
        }, ApiCodes.DB_USER_FOUND_BY_PHONE, "user with same phone already exists", 400)
        .execute(next);
    };
  }

  /**
   * @apiDefine v000UniqueCheckItnAndPsrn
   *
   * @apiError (Bad Request 400 - Юридическое лицо уже существует) {string="DB_ENTITY_FOUND_BY_ITN_AND_PSRN"} code
   * Код ошибки
   * @apiError (Bad Request 400 - Юридическое лицо уже существует) {string} message Подробное описание ошибки
   *
   * @apiError (Bad Request 400 - ИНН уже существует) {string="DB_ENTITY_FOUND_BY_ITN"} code Код ошибки
   * @apiError (Bad Request 400 - ИНН уже существует) {string} message Подробное описание ошибки
   *
   * @apiError (Bad Request 400 - ОГРН уже существует) {string="DB_ENTITY_FOUND_BY_PSRN"} code Код ошибки
   * @apiError (Bad Request 400 - ОГРН уже существует) {string} message Подробное описание ошибки
   */

  /**
   * Check ITN and PSRN for unique middleware
   * @param getItnAndPsrn Get ITN and PSRN
   */
  public static checkItnAndPsrnMiddleware(getItnAndPsrn: (req: Request) => { itn: number, psrn: number }) {
    return async (req: Request, res: Response, next: NextFunction) => {
      let checkResult: {
        itn: boolean,
        psrn: boolean,
      };
      await res.achain
        .action(async () => {
          const {itn, psrn} = getItnAndPsrn(req);
          checkResult = await Unique.checkItnAndPsrn(itn.toString(), psrn.toString());
        })
        .check(() => {
          return !(checkResult.itn && checkResult.psrn);
        }, ApiCodes.DB_ENTITY_FOUND_BY_ITN_AND_PSRN, "entity with same itn and psrn already exists", 400)
        .check(() => {
          return !(checkResult.itn && !checkResult.psrn);
        }, ApiCodes.DB_ENTITY_FOUND_BY_ITN, "entity with same itn already exists", 400)
        .check(() => {
          return !(!checkResult.itn && checkResult.psrn);
        }, ApiCodes.DB_ENTITY_FOUND_BY_PSRN, "entity with same psrn already exists", 400)
        .execute(next);
    };
  }
}
