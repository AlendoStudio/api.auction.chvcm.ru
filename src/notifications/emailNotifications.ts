import {EventEmitter} from "events";

import * as debug from "debug";
import * as path from "path";

import * as cachePugTemplates from "cache-pug-templates";
import * as Email from "email-templates";
import * as nodemailer from "nodemailer";

import {Global} from "../../global";
import {Const} from "../const";
import {Env} from "../env";
import {IEntityAttributes, IUserAttributes} from "../interfaces";
import {RedisClient} from "../redis";

/**
 * "EmailOptions" interface from Type definitions for node-email-templates 3.5
 */
interface IEmailOptions {
  /**
   * The template name
   */
  template: string;

  /**
   * Nodemailer Message <Nodemailer.com/message/>
   */
  message: nodemailer.SendMailOptions;

  /**
   * The Template Variables
   */
  locals: any;
}

/**
 * Email notifications
 */
export class EmailNotifications extends EventEmitter {
  /**
   * Email event
   * @type {string}
   */
  public static readonly EMAIL_EVENT = "EMAIL_EVENT";

  /**
   * Instantiate instance with SMTP transport
   */
  public static instantiateSmtp() {
    this._instance = new EmailNotifications(nodemailer.createTransport(Env.EMAIL_SMTP));
  }

  /**
   * Instance
   * @return {EmailNotifications}
   */
  public static get instance() {
    return this._instance;
  }

  private static _instance: EmailNotifications;

  private readonly _email: Email;
  private readonly _i18nDebug: debug.IDebugger;
  private readonly _i18nWarn: debug.IDebugger;
  private readonly _i18nError: debug.IDebugger;

  private constructor(transport: nodemailer.Transporter) {
    super();
    this._i18nDebug = debug("i18n:debug");
    this._i18nWarn = debug("i18n:warn");
    this._i18nError = debug("i18n:error");
    const views = path.join(Global.baseDir, "emails", "templates");
    // noinspection JSUnusedGlobalSymbols
    this._email = new Email({
      i18n: {
        defaultLocale: "en",
        directory: path.join(Global.baseDir, "emails", "locales"),
        locales: ["ru", "en"],
        logger: {
          debug: (msg: any) => {
            this._i18nDebug(msg);
          },
          error: (msg: any) => {
            this._i18nError(msg);
          },
          warn: (msg: any) => {
            this._i18nWarn(msg);
          },
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
    if (Const.PRODUCTION) {
      cachePugTemplates(RedisClient.instance, views);
    }
  }

  /**
   * Send "signin" message
   * @param user User
   */
  public async signin(user: IUserAttributes) {
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
   * Send "signup" message
   * @param user
   */
  public async signup(user: IUserAttributes) {
    await this.send({
      locals: {
        locale: user.language,
        name: user.name,
      },
      message: {
        to: user.email as string,
      },
      template: "signup",
    });
  }

  /**
   * Send "signinTfa" message
   * @param user User
   */
  public async signinTfa(user: IUserAttributes) {
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
   * Send "tfaEmail" message
   * @param user User
   * @param token Token
   */
  public async tfaEmail(user: IUserAttributes, token: string) {
    await this.send({
      locals: {
        locale: user.language,
        name: user.name,
        token,
      },
      message: {
        to: user.email as string,
      },
      template: "tfa_email",
    });
  }

  /**
   * Send "passwordReset" message
   * @param user User
   * @param token Token
   */
  public async passwordReset(user: IUserAttributes, token: string) {
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
   */
  public async passwordResetComplete(user: IUserAttributes) {
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
   * Send "inviteEmployee" message
   * @param user User
   */
  public async inviteEmployee(user: IUserAttributes) {
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
   * Send "banned" message
   * @param user User
   */
  public async banned(user: IUserAttributes) {
    await this.send({
      locals: {
        locale: user.language,
        name: user.name,
      },
      message: {
        to: user.email as string,
      },
      template: "banned",
    });
  }

  /**
   * Send "unbanned" message
   * @param user User
   */
  public async unbanned(user: IUserAttributes) {
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
   * Send "entity" message
   * @param entity Entity
   */
  public async verified(entity: IEntityAttributes) {
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

  /**
   * Send "unverified" message
   * @param entity Entity
   */
  public async unverified(entity: IEntityAttributes) {
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
   * Send "test" message
   * @param to To
   */
  public async test(to: string) {
    await this.send({
      locals: {},
      message: {
        to,
      },
      template: "test",
    });
  }

  private async send(options: IEmailOptions) {
    const res = await this._email.send(options);
    if (Const.STAGING) {
      this.emit(EmailNotifications.EMAIL_EVENT, res);
    }
  }
}
