import {NextFunction, Request, Response} from "express";

import {
  ApiCodes,
  Const,
  EmailNotifications,
  IEmployeeAttributes,
  IEntityAttributes,
  ISignUser,
  IUserCommonAttributes,
  IUserInstance,
  Jwt,
  Sequelize,
} from "../index";

/**
 * Auth middleware collection
 */
export class Auth {
  /**
   * @apiDefine v000AuthSignUser
   *
   * @apiSuccess {boolean} tfa Включена ли двухэтапная аутентификация?
   * @apiSuccess {string} token Токен аутентификации
   */

  /**
   * Sign user
   * @param callbacks Callbacks
   */
  public static signUser(...callbacks: Array<(req: Request) => Promise<void>>):
    (req: Request, res: Response) => Promise<void> {
    return async (req: Request, res: Response) => {
      let token: string;
      await res.achain
        .action(async () => {
          token = await Jwt.signUser({
            id: req.user.id as string,
            type: req.user.type as string,
          });
        })
        .action(async () => {
          await Sequelize.instance.transaction(async () => {
            for (const callback of callbacks) {
              await callback(req);
            }
            await EmailNotifications.instance.signin(req.user);
          });
        })
        .json(() => {
          return {
            tfa: req.user.tfa,
            token,
          };
        })
        .execute();
    };
  }

  /**
   * Delete purgatory token
   * @param {e.Request} req Request
   * @return {Promise<void>}
   */
  public static async deletePurgatoryToken(req: Request) {
    await Sequelize.instance.tokensTfaPurgatory.destroy({
      where: {
        token: req.token,
      },
    });
  }

  /**
   * Delete recovery token
   * @param {e.Request} req Request
   * @return {Promise<void>}
   */
  public static async deleteRecoveryToken(req: Request) {
    await Sequelize.instance.tokensTfaRecovery.destroy({
      where: {
        token: req.body.value.token.value,
      },
    });
  }

  /**
   * @apiDefine v000AuthAuth
   *
   * @apiHeader (Authorization) {string} Authorization **Bearer** токен аутентификации
   *
   * @apiError (Unauthorized 401 - Неверный токен аутентификации) {string="JWT_VERIFY_USER"} code Код ошибки
   * @apiError (Unauthorized 401 - Неверный токен аутентификации) {string} message Подробное описание ошибки
   *
   * @apiError (Unauthorized 401 - Сотрудник не найден) {string="DB_EMPLOYEE_NOT_FOUND_BY_ID"} code Код ошибки
   * @apiError (Unauthorized 401 - Сотрудник не найден) {string} message Подробное описание ошибки
   *
   * @apiError (Unauthorized 401 - Юридическое лицо не найдено) {string="DB_ENTITY_NOT_FOUND_BY_ID"} code Код ошибки
   * @apiError (Unauthorized 401 - Юридическое лицо не найдено) {string} message Подробное описание ошибки
   *
   * @apiError (Unauthorized 401 - Пользователь забанен) {string="BANNED"} code Код ошибки
   * @apiError (Unauthorized 401 - Пользователь забанен) {string} message Подробное описание ошибки
   */

  /**
   * Auth via auth token middleware
   * @param {e.Request} req Request
   * @param {e.Response} res Response
   * @param {e.NextFunction} next Next function
   * @return {Promise<void>}
   */
  public static async auth(req: Request, res: Response, next: NextFunction) {
    let verifiedUser: ISignUser;
    let verifyUserError: Error;
    let commonUser: IUserCommonAttributes;
    await res.achain
      .check(async () => {
        try {
          verifiedUser = await Jwt.verifyUser(req.token);
          return true;
        } catch (error) {
          verifyUserError = error;
          return false;
        }
      }, ApiCodes.JWT_VERIFY_USER, () => verifyUserError.message, 401)
      .checkout(() => {
        return verifiedUser.type;
      })
      .fork(Const.USER_TYPE_EMPLOYEE)
      .action(async () => {
        req.employee = (await Sequelize.instance.employee.findById(verifiedUser.id)) as IEmployeeAttributes;
        commonUser = req.employee;
      })
      .check(() => {
        return !!req.employee;
      }, ApiCodes.DB_EMPLOYEE_NOT_FOUND_BY_ID, "employee with same id not found", 401)
      .fork(Const.USER_TYPE_ENTITY)
      .action(async () => {
        req.entity = (await Sequelize.instance.entity.findById(verifiedUser.id)) as IEntityAttributes;
        commonUser = req.entity;
      })
      .check(() => {
        return !!req.entity;
      }, ApiCodes.DB_ENTITY_NOT_FOUND_BY_ID, "entity with same id not found", 401)
      .fork()
      .check(() => {
        return !!commonUser && !commonUser.banned;
      }, ApiCodes.BANNED, "user was banned", 401)
      .action(() => {
        req.user = {
          authenticator: commonUser.authenticator,
          banned: commonUser.banned,
          email: commonUser.email,
          id: commonUser.id,
          language: commonUser.language,
          name: commonUser.name,
          password: commonUser.password,
          phone: commonUser.phone,
          registration: commonUser.registration,
          tfa: commonUser.tfa,
          type: verifiedUser.type,
        };
      })
      .execute(next);
  }

  /**
   * @apiDefine v000AuthPurgatory
   *
   * @apiHeader (Authorization Header) {string} Authorization **Bearer** временный токен аутентификации
   *
   * @apiError (Unauthorized 401 - Пользователь не найден) {string="DB_USER_NOT_FOUND_BY_PURGATORY_TOKEN"} code
   * Код ошибки
   * @apiError (Unauthorized 401 - Пользователь не найден) {string} message Подробное описание ошибки
   *
   * @apiError (Unauthorized 401 - Пользователь забанен) {string="BANNED"} code Код ошибки
   * @apiError (Unauthorized 401 - Пользователь забанен) {string} message Подробное описание ошибки
   */

  /**
   * Auth via purgatory token middleware
   * @param {e.Request} req Request
   * @param {e.Response} res Response
   * @param {e.NextFunction} next Next function
   * @return {Promise<void>}
   */
  public static async authPurgatory(req: Request, res: Response, next: NextFunction) {
    await res.achain
      .action(async () => {
        req.user = await Sequelize.instance.user.findOne({
          include: [{
            model: Sequelize.instance.tokensTfaPurgatory,
            where: {
              expires: {
                [Sequelize.op.gt]: new Date(),
              },
              token: req.token,
            },
          }],
        }) as IUserInstance;
      })
      .check(() => {
        return !!req.user;
      }, ApiCodes.DB_USER_NOT_FOUND_BY_PURGATORY_TOKEN, "user not found by purgatory token", 401)
      .check(() => {
        return !!req.user && !req.user.banned;
      }, ApiCodes.BANNED, "user was banned", 401)
      .execute(next);
  }

  /**
   * @apiDefine v000AuthRequireModerator
   *
   * @apiError (Unauthorized 401 - Требуется модератор) {string="REQUIRED_MODERATOR"} code Код ошибки
   * @apiError (Unauthorized 401 - Требуется модератор) {string} message Подробное описание ошибки
   */

  /**
   * Require moderator access
   * @param {e.Request} req Request
   * @param {e.Response} res Response
   * @param {e.NextFunction} next Next function
   * @return {Promise<void>}
   */
  public static async requireModerator(req: Request, res: Response, next: NextFunction) {
    await res.achain
      .check(() => {
        return !!req.employee && !!req.employee.moderator;
      }, ApiCodes.REQUIRED_MODERATOR, "required moderator", 401)
      .execute(next);
  }

  /**
   * @apiDefine v000AuthRequireAdmin
   *
   * @apiError (Unauthorized 401 - Требуется администратор) {string="REQUIRED_ADMIN"} code Код ошибки
   * @apiError (Unauthorized 401 - Требуется администратор) {string} message Подробное описание ошибки
   */

  /**
   * Require admin access
   * @param {e.Request} req Request
   * @param {e.Response} res Response
   * @param {e.NextFunction} next Next function
   * @return {Promise<void>}
   */
  public static async requireAdmin(req: Request, res: Response, next: NextFunction) {
    await res.achain
      .check(() => {
        return !!req.employee && !!req.employee.admin;
      }, ApiCodes.REQUIRED_ADMIN, "required admin", 401)
      .execute(next);
  }

  /**
   * @apiDefine v000AuthRequireEntity
   *
   * @apiError (Unauthorized 401 - Требуется юридическое лицо) {string="REQUIRED_ENTITY"} code Код ошибки
   * @apiError (Unauthorized 401 - Требуется юридическое лицо) {string} message Подробное описание ошибки
   */

  /**
   * Require entity access
   * @param {e.Request} req Request
   * @param {e.Response} res Response
   * @param {e.NextFunction} next Next function
   * @return {Promise<void>}
   */
  public static async requireEntity(req: Request, res: Response, next: NextFunction) {
    await res.achain
      .check(() => {
        return !!req.entity;
      }, ApiCodes.REQUIRED_ENTITY, "required entity", 401)
      .execute(next);
  }

  /**
   * @apiDefine v000AuthRequireVerifiedEntity
   *
   * @apiError (Unauthorized 401 - Требуется проверенное юридическое лицо) {string="REQUIRED_VERIFIED_ENTITY"} code
   * Код ошибки
   * @apiError (Unauthorized 401 - Требуется проверенное юридическое лицо) {string} message Подробное описание ошибки
   */

  /**
   * Require verified entity access
   * @param {e.Request} req Request
   * @param {e.Response} res Response
   * @param {e.NextFunction} next Next function
   * @return {Promise<void>}
   */
  public static async requireVerifiedEntity(req: Request, res: Response, next: NextFunction) {
    await res.achain
      .check(() => {
        return !!req.entity && !!req.entity.verified;
      }, ApiCodes.REQUIRED_VERIFIED_ENTITY, "required verified entity", 401)
      .execute(next);
  }
}
