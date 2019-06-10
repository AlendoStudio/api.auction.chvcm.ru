import {EventEmitter} from "events";
import * as path from "path";

import * as debug from "debug";
import * as Email from "email-templates";
import * as nodemailer from "nodemailer";

import {baseDir} from "../../global";
import {Const} from "../const";
import {Env} from "../env";
import {IEmailOptions, IEmailUser} from "../interfaces";

/**
 * Email notifications
 */
export class EmailNotifications extends EventEmitter {
  /**
   * Email event
   */
  public static readonly EMAIL_EVENT: string = "EMAIL_EVENT";

  /**
   * Instantiate instance with SMTP transport
   */
  public static instantiateSmtp(): void {
    this._instance = new EmailNotifications(
      nodemailer.createTransport(Env.EMAIL_SMTP),
    );
  }

  /**
   * Instance
   */
  public static get instance(): EmailNotifications {
    return this._instance;
  }

  private static _instance: EmailNotifications;

  private readonly _transport: nodemailer.Transporter;
  private readonly _email: Email;
  private readonly _i18nDebug: debug.IDebugger;
  private readonly _i18nWarn: debug.IDebugger;
  private readonly _i18nError: debug.IDebugger;

  private constructor(transport: nodemailer.Transporter) {
    super();
    this._transport = transport;
    this._i18nDebug = debug("i18n:debug");
    this._i18nWarn = debug("i18n:warn");
    this._i18nError = debug("i18n:error");
    const views = path.join(baseDir, "emails", "templates");
    // noinspection JSUnusedGlobalSymbols
    this._email = new Email({
      i18n: {
        defaultLocale: "en",
        directory: path.join(baseDir, "emails", "locales"),
        locales: ["ru", "en"],
        logger: {
          debug: (msg: string) => {
            this._i18nDebug(msg);
          },
          error: (msg: string) => {
            this._i18nError(msg);
          },
          warn: (msg: string) => {
            this._i18nWarn(msg);
          },
        },
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          images: true,
          relativeTo: baseDir,
        },
      },
      message: {
        from: Env.EMAIL_FROM,
      },
      preview: Const.STAGING && Env.EMAIL_PREVIEW,
      send: Const.PRODUCTION,
      transport,
      views: {
        root: views,
      },
    });
  }

  /**
   * Closes all connections in the pool.
   * If there is a message being sent, the connection is closed later
   */
  public close(): void {
    this._transport.close();
  }

  /**
   * Send "banned" message
   * @param user User
   * @param message Message
   * @throws Error
   */
  public async banned(user: IEmailUser, message?: string): Promise<void> {
    await this.send({
      locals: {
        locale: user.language,
        message,
        name: user.name,
      },
      message: {
        to: user.email as string,
      },
      template: "banned",
    });
  }

  /**
   * Send "inviteEmployee" message
   * @param user User
   * @throws Error
   */
  public async inviteEmployee(user: IEmailUser): Promise<void> {
    await this.send({
      locals: {
        locale: user.language,
        name: user.name,
      },
      message: {
        to: user.email as string,
      },
      template: "invite_employee",
    });
  }

  /**
   * Send "passwordReset" message
   * @param user User
   * @param token Token
   * @throws Error
   */
  public async passwordReset(user: IEmailUser, token: string): Promise<void> {
    await this.send({
      locals: {
        locale: user.language,
        name: user.name,
        token,
      },
      message: {
        to: user.email as string,
      },
      template: "password_reset",
    });
  }

  /**
   * Send "passwordResetComplete" message
   * @param user User
   * @throws Error
   */
  public async passwordResetComplete(user: IEmailUser): Promise<void> {
    await this.send({
      locals: {
        locale: user.language,
        name: user.name,
      },
      message: {
        to: user.email as string,
      },
      template: "password_reset_complete",
    });
  }

  /**
   * Send "signin" message
   * @param user User
   * @throws Error
   */
  public async signin(user: IEmailUser): Promise<void> {
    await this.send({
      locals: {
        locale: user.language,
        name: user.name,
      },
      message: {
        to: user.email as string,
      },
      template: "signin",
    });
  }

  /**
   * Send "signinTfa" message
   * @param user User
   * @throws Error
   */
  public async signinTfa(user: IEmailUser): Promise<void> {
    await this.send({
      locals: {
        locale: user.language,
        name: user.name,
      },
      message: {
        to: user.email as string,
      },
      template: "signin_tfa",
    });
  }

  /**
   * Send "signup" message
   * @param entity
   * @throws Error
   */
  public async signup(entity: IEmailUser): Promise<void> {
    await this.send({
      locals: {
        locale: entity.language,
        name: entity.name,
      },
      message: {
        to: entity.email as string,
      },
      template: "signup",
    });
  }

  /**
   * Send "test" message
   * @param to To
   * @param locale Locale
   * @throws Error
   */
  public async test(to: string, locale: string = "en"): Promise<void> {
    await this.send({
      locals: {
        locale,
      },
      message: {
        to,
      },
      template: "test",
    });
  }

  /**
   * Send "unbanned" message
   * @param user User
   * @throws Error
   */
  public async unbanned(user: IEmailUser): Promise<void> {
    await this.send({
      locals: {
        locale: user.language,
        name: user.name,
      },
      message: {
        to: user.email as string,
      },
      template: "unbanned",
    });
  }

  /**
   * Send "unverified" message
   * @param entity Entity
   * @throws Error
   */
  public async unverified(entity: IEmailUser): Promise<void> {
    await this.send({
      locals: {
        locale: entity.language,
        name: entity.name,
      },
      message: {
        to: entity.email as string,
      },
      template: "unverified",
    });
  }

  /**
   * Send "verified" message
   * @param entity Entity
   * @throws Error
   */
  public async verified(entity: IEmailUser): Promise<void> {
    await this.send({
      locals: {
        locale: entity.language,
        name: entity.name,
      },
      message: {
        to: entity.email as string,
      },
      template: "verified",
    });
  }

  private async send(options: IEmailOptions): Promise<void> {
    const res = await this._email.send(options);
    if (Const.STAGING) {
      this.emit(EmailNotifications.EMAIL_EVENT, res);
    }
  }
}
