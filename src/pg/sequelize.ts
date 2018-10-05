import * as cuid from "cuid";
import * as SuperSequelize from "sequelize";

import {Const} from "../const";
import {Env} from "../env";
import {
  IAttachmentAttributes, IAttachmentInstance, IAttachmentModel,
  IEmployeeAttributes, IEmployeeInstance, IEmployeeModel,
  IEntityAttributes, IEntityInstance, IEntityModel,
  ILotAttributes, ILotInstance, ILotModel,
  ILotParticipantsAttributes, ILotParticipantsInstance, ILotParticipantsModel,
  IStuffAttributes, IStuffInstance, IStuffModel,
  IStuffTranslationsAttributes, IStuffTranslationsInstance, IStuffTranslationsModel,
  ITokensPasswordResetAttributes, ITokensPasswordResetInstance, ITokensPasswordResetModel,
  ITokensTfaEmailAttributes, ITokensTfaEmailInstance, ITokensTfaEmailModel,
  ITokensTfaPurgatoryAttributes, ITokensTfaPurgatoryInstance, ITokensTfaPurgatoryModel,
  ITokensTfaRecoveryAttributes, ITokensTfaRecoveryInstance, ITokensTfaRecoveryModel,
  IUserAttributes, IUserInstance, IUserModel,
} from "../interfaces";

/**
 * Sequelize
 */
export class Sequelize extends SuperSequelize {
  /**
   * Instantiate instance for Web
   */
  public static instantiateWeb() {
    Sequelize._instance = new Sequelize({
      poolMax: Env.DATABASE_POOL_MAX_WEB || Env.DATABASE_POOL_MAX_WORKER,
    });
  }

  /**
   * Instantiate instance for Worker
   */
  public static instantiateWorker() {
    Sequelize._instance = new Sequelize({
      poolMax: Env.DATABASE_POOL_MAX_WORKER || Env.DATABASE_POOL_MAX_WEB,
    });
  }

  /**
   * Operators
   * @return {sequelize.Operators}
   */
  public static get op() {
    return SuperSequelize.Op;
  }

  /**
   * Instance
   * @return {Sequelize}
   */
  public static get instance() {
    return Sequelize._instance;
  }

  private static _instance: Sequelize;

  private static get defineUserCommonAttributes(): SuperSequelize.DefineAttributes {
    return {
      authenticator: {
        allowNull: true,
        type: SuperSequelize.STRING,
      },
      banned: {
        allowNull: false,
        defaultValue: false,
        type: SuperSequelize.BOOLEAN,
      },
      email: {
        allowNull: false,
        type: SuperSequelize.STRING,
        unique: true,
      },
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: SuperSequelize.BIGINT,
      },
      language: {
        allowNull: false,
        type: "LANGUAGE_CODE",
      },
      name: {
        allowNull: false,
        type: SuperSequelize.STRING,
      },
      password: {
        allowNull: true,
        type: SuperSequelize.STRING,
      },
      phone: {
        allowNull: false,
        type: SuperSequelize.STRING,
        unique: true,
      },
      registration: {
        allowNull: false,
        defaultValue: SuperSequelize.NOW,
        type: SuperSequelize.DATE,
      },
      tfa: {
        allowNull: false,
        defaultValue: false,
        type: SuperSequelize.BOOLEAN,
      },
    };
  }

  private static get defineTokensBaseAttributes(): SuperSequelize.DefineAttributes {
    return {
      token: {
        defaultValue() {
          return cuid();
        },
        primaryKey: true,
        type: SuperSequelize.STRING,
      },
    };
  }

  private static get defineTokensTfaRecoveryAttributes(): SuperSequelize.DefineAttributes {
    const attributes = Sequelize.defineTokensBaseAttributes;
    attributes.userid = {
      allowNull: false,
      type: SuperSequelize.BIGINT,
    };
    return attributes;
  }

  private static defineTokensTfaPurgatoryAndPasswordResetAttributes(expiresin: number):
    SuperSequelize.DefineAttributes {
    const attributes = Sequelize.defineTokensTfaRecoveryAttributes;
    attributes.expires = {
      allowNull: false,
      defaultValue() {
        return new Date(Date.now() + expiresin);
      },
      type: SuperSequelize.DATE,
    };
    return attributes;
  }

  private _user: IUserModel = undefined as any;
  private _employee: IEmployeeModel = undefined as any;
  private _entity: IEntityModel = undefined as any;
  private _attachment: IAttachmentModel = undefined as any;
  private _tokensTfaPurgatory: ITokensTfaPurgatoryModel = undefined as any;
  private _tokensPasswordReset: ITokensPasswordResetModel = undefined as any;
  private _tokensTfaRecovery: ITokensTfaRecoveryModel = undefined as any;
  private _tokensTfaEmail: ITokensTfaEmailModel = undefined as any;
  private _stuff: IStuffModel = undefined as any;
  private _stuffTranslations: IStuffTranslationsModel = undefined as any;
  private _lot: ILotModel = undefined as any;
  private _lotParticipants: ILotParticipantsModel = undefined as any;

  /**
   * Sequelize constructor
   * @param {{poolMax: number}} options Options
   */
  public constructor(options: {
    /**
     * Max pool connections
     */
    poolMax: number,
  }) {
    super(Env.DATABASE_URL, {
      define: {
        timestamps: false,
      },
      dialect: "postgres",
      dialectOptions: {
        ssl: Env.DATABASE_SSL,
      },
      logging: false,
      native: Env.DATABASE_NATIVE,
      pool: {
        max: options.poolMax,
      },
    });
    this.defineUser();
    this.defineEmployee();
    this.defineEntity();
    this.defineAttachment();
    this.defineTokensTfaPurgatory();
    this.defineTokensPasswordReset();
    this.defineTokensTfaRecovery();
    this.defineTokensTfaEmail();
    this.defineStuff();
    this.defineStuffTranslations();
    this.defineLot();
    this.defineLotParticipants();
  }

  /**
   * User
   * @return {IUserModel}
   */
  public get user() {
    return this._user;
  }

  /**
   * Employee
   * @return {IEmployeeModel}
   */
  public get employee() {
    return this._employee;
  }

  /**
   * Entity
   * @return {IEntityModel}
   */
  public get entity() {
    return this._entity;
  }

  /**
   * Attachment
   * @return {IAttachmentModel}
   */
  public get attachment() {
    return this._attachment;
  }

  /**
   * Tokens TFA purgatory
   * @return {ITokensTfaPurgatoryModel}
   */
  public get tokensTfaPurgatory() {
    return this._tokensTfaPurgatory;
  }

  /**
   * Tokens password reset
   * @return {ITokensPasswordResetModel}
   */
  public get tokensPasswordReset() {
    return this._tokensPasswordReset;
  }

  /**
   * Tokens TFA recovery
   * @return {ITokensTfaRecoveryModel}
   */
  public get tokensTfaRecovery() {
    return this._tokensTfaRecovery;
  }

  /**
   * Tokens TFA email
   * @return {ITokensTfaEmailModel}
   */
  public get tokensTfaEmail() {
    return this._tokensTfaEmail;
  }

  /**
   * Stuff
   * @return {IStuffModel}
   */
  public get stuff() {
    return this._stuff;
  }

  /**
   * Stuff translations
   * @return {IStuffTranslationsModel}
   */
  public get stuffTranslations() {
    return this._stuffTranslations;
  }

  /**
   * Lot
   * @return {ILotModel}
   */
  public get lot() {
    return this._lot;
  }

  /**
   * Lot participants
   * @return {ILotParticipantsModel}
   */
  public get lotParticipants() {
    return this._lotParticipants;
  }

  private defineUser() {
    const attributes = Sequelize.defineUserCommonAttributes;
    attributes.type = {
      allowNull: false,
      type: "USER_TYPE",
      values: ["employee", "entity"],
    };
    this._user = this.define<IUserInstance, IUserAttributes>("users_common", attributes, {
      freezeTableName: true,
    });
  }

  private defineEmployee() {
    const attributes = Sequelize.defineUserCommonAttributes;
    attributes.admin = {
      allowNull: false,
      defaultValue: false,
      type: SuperSequelize.BOOLEAN,
    };
    attributes.moderator = {
      allowNull: false,
      defaultValue: false,
      type: SuperSequelize.BOOLEAN,
    };
    this._employee = this.define<IEmployeeInstance, IEmployeeAttributes>("employees", attributes, {
      freezeTableName: true,
    });
  }

  private defineEntity() {
    const attributes = Sequelize.defineUserCommonAttributes;
    attributes.ceo = {
      allowNull: false,
      type: SuperSequelize.STRING,
    };
    attributes.psrn = {
      allowNull: false,
      type: SuperSequelize.BIGINT,
      unique: true,
    };
    attributes.itn = {
      allowNull: false,
      type: SuperSequelize.BIGINT,
      unique: true,
    };
    attributes.verified = {
      allowNull: false,
      defaultValue: false,
      type: SuperSequelize.BOOLEAN,
    };
    this._entity = this.define<IEntityInstance, IEntityAttributes>("entities", attributes, {
      freezeTableName: true,
    });
  }

  private defineAttachment() {
    this._attachment = this.define<IAttachmentInstance, IAttachmentAttributes>("attachments", {
      url: {
        allowNull: false,
        type: SuperSequelize.TEXT,
      },
      userid: {
        primaryKey: true,
        type: SuperSequelize.BIGINT,
      },
    }, {
      freezeTableName: true,
    });
    this.entity.hasMany(this._attachment, {
      foreignKey: "userid",
      sourceKey: "id",
    });
    this._attachment.belongsTo(this.entity, {
      foreignKey: "userid",
    });
  }

  private defineTokensTfaPurgatory() {
    this._tokensTfaPurgatory = this.define<ITokensTfaPurgatoryInstance, ITokensTfaPurgatoryAttributes>(
      "tokens_tfa_purgatory",
      Sequelize.defineTokensTfaPurgatoryAndPasswordResetAttributes(Const.TOKENS_TFA_PURGATORY_EXPIRESIN), {
        freezeTableName: true,
      });
    this.user.hasMany(this._tokensTfaPurgatory, {
      foreignKey: "userid",
      sourceKey: "id",
    });
    this._tokensTfaPurgatory.belongsTo(this.user, {
      foreignKey: "userid",
    });
  }

  private defineTokensPasswordReset() {
    this._tokensPasswordReset = this.define<ITokensPasswordResetInstance, ITokensPasswordResetAttributes>(
      "tokens_password_reset",
      Sequelize.defineTokensTfaPurgatoryAndPasswordResetAttributes(Const.TOKENS_PASSWORD_RESET_EXPIRESIN), {
        freezeTableName: true,
      });
    this.user.hasMany(this._tokensPasswordReset, {
      foreignKey: "userid",
      sourceKey: "id",
    });
    this._tokensPasswordReset.belongsTo(this.user, {
      foreignKey: "userid",
    });
  }

  private defineTokensTfaRecovery() {
    this._tokensTfaRecovery = this.define<ITokensTfaRecoveryInstance, ITokensTfaRecoveryAttributes>(
      "tokens_tfa_recovery", Sequelize.defineTokensTfaRecoveryAttributes, {
        freezeTableName: true,
      });
    this.user.hasMany(this._tokensTfaRecovery, {
      foreignKey: "userid",
      sourceKey: "id",
    });
    this._tokensTfaRecovery.belongsTo(this.user, {
      foreignKey: "userid",
    });
  }

  private defineTokensTfaEmail() {
    const attributes = Sequelize.defineTokensBaseAttributes;
    attributes.purgatory = {
      allowNull: false,
      type: SuperSequelize.STRING,
    };
    this._tokensTfaEmail = this.define<ITokensTfaEmailInstance, ITokensTfaEmailAttributes>(
      "tokens_tfa_email", attributes, {
        freezeTableName: true,
      });
    this.tokensTfaPurgatory.hasMany(this._tokensTfaEmail, {
      foreignKey: "purgatory",
      sourceKey: "token",
    });
    this._tokensTfaEmail.belongsTo(this.tokensTfaPurgatory, {
      foreignKey: "purgatory",
    });
  }

  private defineStuff() {
    this._stuff = this.define<IStuffInstance, IStuffAttributes>("stuffs", {
      enabled: {
        allowNull: false,
        defaultValue: true,
        type: SuperSequelize.BOOLEAN,
      },
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: SuperSequelize.BIGINT,
      },
    }, {
      freezeTableName: true,
    });
  }

  private defineStuffTranslations() {
    this._stuffTranslations = this.define<IStuffTranslationsInstance, IStuffTranslationsAttributes>(
      "stuff_translations", {
        code: {
          primaryKey: true,
          type: "LANGUAGE_CODE",
        },
        stuffid: {
          primaryKey: true,
          type: SuperSequelize.BIGINT,
        },
        translation: {
          allowNull: false,
          type: SuperSequelize.JSONB,
        },
      }, {
        freezeTableName: true,
      });
    this.stuff.hasMany(this._stuffTranslations, {
      foreignKey: "stuffid",
      sourceKey: "id",
    });
    this._stuffTranslations.belongsTo(this.stuff, {
      foreignKey: "stuffid",
    });
  }

  private defineLot() {
    this._lot = this.define<ILotInstance, ILotAttributes>("lots", {
      amount: {
        allowNull: false,
        type: SuperSequelize.NUMERIC,
      },
      amount_type: {
        allowNull: false,
        type: "LOT_AMOUNT_TYPE",
      },
      buffer: {
        allowNull: false,
        type: "INTERVAL",
      },
      currency: {
        allowNull: false,
        type: "CURRENCY",
      },
      finish: {
        allowNull: false,
        type: SuperSequelize.DATE,
      },
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: SuperSequelize.BIGINT,
      },
      participants: {
        allowNull: false,
        defaultValue: 0,
        type: SuperSequelize.BIGINT,
      },
      start: {
        allowNull: false,
        type: SuperSequelize.DATE,
      },
      startbid: {
        allowNull: false,
        type: SuperSequelize.NUMERIC,
      },
      step: {
        allowNull: false,
        type: SuperSequelize.NUMERIC,
      },
      stuffid: {
        allowNull: false,
        type: SuperSequelize.BIGINT,
      },
      type: {
        allowNull: false,
        type: "LOT_TYPE",
      },
      winbid: {
        type: SuperSequelize.NUMERIC,
      },
      winner: {
        type: SuperSequelize.BIGINT,
      },
    }, {
      freezeTableName: true,
    });
    this.stuff.hasMany(this._lot, {
      foreignKey: "stuffid",
      sourceKey: "id",
    });
    this._lot.belongsTo(this.stuff, {
      foreignKey: "stuffid",
    });
    this.entity.hasMany(this._lot, {
      foreignKey: "winner",
      sourceKey: "id",
    });
    this._lot.belongsTo(this.entity, {
      foreignKey: "winner",
    });
  }

  private defineLotParticipants() {
    this._lotParticipants = this.define<ILotParticipantsInstance, ILotParticipantsAttributes>(
      "lot_participants", {
        lotid: {
          primaryKey: true,
          type: SuperSequelize.BIGINT,
        },
        userid: {
          primaryKey: true,
          type: SuperSequelize.BIGINT,
        },
      }, {
        freezeTableName: true,
      });
    this.lot.hasMany(this._lotParticipants, {
      foreignKey: "lotid",
      sourceKey: "id",
    });
    this._lotParticipants.belongsTo(this.lot, {
      foreignKey: "lotid",
    });
    this.entity.hasMany(this._lotParticipants, {
      foreignKey: "userid",
      sourceKey: "id",
    });
    this._lotParticipants.belongsTo(this.entity, {
      foreignKey: "userid",
    });
  }
}
