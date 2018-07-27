import ms = require("ms");
import {ZXCVBNScore} from "zxcvbn";

import {Env} from "./env";

/**
 * Constants
 */
export class Const {
  /**
   * API mount point
   * @type {string}
   */
  public static readonly API_MOUNT_POINT: string = "/api/v0";

  /**
   * Production environment
   * @type {boolean}
   */
  public static readonly PRODUCTION: boolean = Env.NODE_ENV === "production";

  /**
   * Staging environment
   * @type {boolean}
   */
  public static readonly STAGING: boolean = Env.NODE_ENV === "staging";

  /**
   * Minimum password score in zxcvbn test >=
   * @type {number}
   */
  public static readonly MINIMUM_PASSWORD_SCORE: ZXCVBNScore = Const.PRODUCTION ? 3 : 1;

  /**
   * BCRYPT salt rounds
   * @type {number}
   */
  public static readonly BCRYPT_SALT_ROUNDS: number = 10;

  /**
   * JWT sign algorithm
   * @type {string}
   */
  public static readonly JWT_ALGORITHM: string = "HS512";

  /**
   * JWT verify algorithms
   * @type {string[]}
   */
  public static readonly JWT_ALGORITHMS: string[] = ["HS512"];

  /**
   * JWT lifetime
   * @type {string}
   */
  public static readonly JWT_EXPIRESIN: string = "100y"; // 100 years

  /**
   * Tokens (password reset) lifetime in milliseconds
   * @type {number}
   */
  public static readonly TOKENS_PASSWORD_RESET_EXPIRESIN: number = ms("1 hours") as number;

  /**
   * Tokens (tfa purgatory) lifetime in milliseconds
   * @type {number}
   */
  public static readonly TOKENS_TFA_PURGATORY_EXPIRESIN: number = ms("1 hours") as number;

  /**
   * User type (employee)
   * @type {string}
   */
  public static readonly USER_TYPE_EMPLOYEE = "employee";

  /**
   * User type (entity)
   * @type {string}
   */
  public static readonly USER_TYPE_ENTITY = "entity";

  /**
   * TFA recovery codes count
   * @type {number}
   */
  public static readonly TFA_RECOVERY_CODES_COUNT = 10;

  /**
   * Google Authenticator service
   * @type {string}
   */
  public static readonly AUTHENTICATOR_SERVICE = "auction.chvcm.ru";
}
