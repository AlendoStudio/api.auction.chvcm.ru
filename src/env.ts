import * as bytes from "bytes";

/**
 * Environment variables
 */
export class Env {
  // Node.js

  /**
   * Node.js environment - "production" or "staging"
   * @type {string}
   */
  public static readonly NODE_ENV: string = process.env.NODE_ENV as string;

  // @alendo/recaptcha

  /**
   * Google reCAPTCHA secret or "disable"
   * @type {string}
   */
  public static readonly RECAPTCHA_SECRET: string = process.env.RECAPTCHA_SECRET as string;

  // DB

  /**
   * Redis URL
   * @type {string}
   */
  public static readonly REDIS_URL: string = process.env.REDIS_URL as string;

  /**
   * PostgreSQL connection string in format
   * "postgres://someuser:somepassword@somehost:381/somedatabase"
   * @type {string}
   */
  public static readonly DATABASE_URL: string = process.env.DATABASE_URL as string;

  /**
   * Use native library?
   * @type {boolean}
   */
  public static readonly DATABASE_NATIVE: boolean = !!process.env.DATABASE_NATIVE;

  /**
   * PostgreSQL max pool clients for Web
   * @type {number}
   */
  public static readonly DATABASE_POOL_MAX_WEB: number =
    parseInt(process.env.DATABASE_POOL_MAX_WEB as string, 10);

  /**
   * PostgreSQL max pool clients for Worker
   * @type {number}
   */
  public static readonly DATABASE_POOL_MAX_WORKER: number =
    parseInt(process.env.DATABASE_POOL_MAX_WORKER as string, 10);

  /**
   * Does PostgreSQL use secure connection?
   * @type {boolean}
   */
  public static readonly DATABASE_SSL: boolean = !!process.env.DATABASE_SSL;

  // web

  /**
   * Port
   * @type {number}
   */
  public static readonly PORT: number = parseInt(process.env.PORT as string, 10);

  /**
   * Host
   * @type {number}
   */
  public static readonly HOST: string = process.env.HOST as string;

  /**
   * CORS - white list (semicolon ";" as separator), leave empty for any
   * @type {string}
   */
  public static readonly CORS_WHITELIST: string[] = (process.env.CORS_WHITELIST || "").split(";").filter((i) => i);

  /**
   * Maximum body size in "bytes" notation
   */
  public static readonly EXPRESS_BODY_PARSER_LIMIT: number = bytes(process.env.EXPRESS_BODY_PARSER_LIMIT as string);

  /**
   * Max file size in "bytes" notation
   */
  public static readonly BUSBOY_LIMITS_FILESIZE: number = bytes(process.env.BUSBOY_LIMITS_FILESIZE as string);

  // email

  /**
   * SMTP email credentials in format
   * "smtps://username:password@smtp.example.com/?pool=true"
   * @type {string}
   */
  public static readonly EMAIL_SMTP: string = process.env.EMAIL_SMTP as string;

  /**
   * Email for use in the address "from"
   * @type {string}
   */
  public static readonly EMAIL_FROM: string = process.env.EMAIL_FROM as string;

  /**
   * Enable email preview?
   * (only in staging mode)
   * @type {boolean}
   */
  public static readonly EMAIL_PREVIEW: boolean = !!process.env.EMAIL_PREVIEW;

  // internal

  /**
   * JSON Web Token secret
   * @type {string}
   */
  public static readonly JWT_SECRET: string = process.env.JWT_SECRET as string;
}
