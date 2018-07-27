import * as SuperSequelize from "sequelize";

export interface IUserCommonAttributes {
  readonly id?: string;
  readonly name?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly password?: string | null;
  readonly authenticator?: string | null;
  readonly tfa?: boolean;
  readonly language?: string;
  readonly banned?: boolean;
  readonly registration?: Date;
}

export interface IUserAttributes extends IUserCommonAttributes {
  readonly type?: string;
}

export type IUserInstance = SuperSequelize.Instance<IUserAttributes> & IUserAttributes;

export type IUserModel = SuperSequelize.Model<IUserInstance, IUserAttributes>;
