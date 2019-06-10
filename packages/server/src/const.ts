import {DurationInputObject} from "moment";
import {ZXCVBNScore} from "zxcvbn";

import {Env} from "./env";

/**
 * Constants
 */
export class Const {
  // Primary

  /**
   * API mount point
   */
  public static readonly API_MOUNT_POINT: string = "/api/v1";

  /**
   * Apidoc mount point
   */
  public static readonly APIDOC_MOUNT_POINT: string = "/apidoc";

  /**
   * Production environment
   */
  public static readonly PRODUCTION: boolean = Env.NODE_ENV === "production";

  /**
   * Staging environment
   */
  public static readonly STAGING: boolean = Env.NODE_ENV === "staging";

  // Secondary

  /**
   * Google Authenticator service
   */
  public static readonly AUTHENTICATOR_SERVICE: string = "auction.chvcm.ru";

  /**
   * AWS S3 "SELECT" limit
   */
  public static readonly AWS_S3_LIMIT_LIMIT: number = 1000;

  /**
   * Bcrypt salt rounds
   */
  public static readonly BCRYPT_SALT_ROUNDS: number = 10;

  /**
   * JWT sign algorithm
   */
  public static readonly JWT_ALGORITHM: string = "HS512";

  /**
   * JWT verify algorithms
   */
  public static readonly JWT_ALGORITHMS: string[] = [Const.JWT_ALGORITHM];

  /**
   * JWT lifetime
   */
  public static readonly JWT_EXPIRESIN: string = "100y"; // 100 years

  /**
   * DB "SELECT" limit
   */
  public static readonly LIMIT_LIMIT: string = "100";

  /**
   * Minimum password score in zxcvbn test >=
   */
  public static readonly MINIMUM_PASSWORD_SCORE: ZXCVBNScore = Const.PRODUCTION
    ? 3
    : 1;

  /**
   * Socket.IO transports
   */
  public static readonly SOCKET_TRANSPORTS: string[] = ["websocket"];

  /**
   * TFA recovery codes count
   */
  public static readonly TFA_RECOVERY_CODES_COUNT: number = 10;

  /**
   * Tokens (password reset) lifetime in milliseconds
   */
  public static readonly TOKENS_PASSWORD_RESET_EXPIRESIN: DurationInputObject = {
    hours: 1,
  };

  /**
   * Tokens (tfa purgatory) lifetime in milliseconds
   */
  public static readonly TOKENS_TFA_PURGATORY_EXPIRESIN: DurationInputObject = {
    hours: 1,
  };

  /**
   * User type (employee)
   */
  public static readonly USER_TYPE_EMPLOYEE: string = "employee";

  /**
   * User type (entity)
   */
  public static readonly USER_TYPE_ENTITY: string = "entity";
}
