import * as SuperSequelize from "sequelize";

export interface ITokensTfaEmailAttributes {
  readonly token?: string;
  readonly purgatory?: string;
}

export type ITokensTfaEmailInstance =
  SuperSequelize.Instance<ITokensTfaEmailAttributes> & ITokensTfaEmailAttributes;

export type ITokensTfaEmailModel = SuperSequelize.Model<ITokensTfaEmailInstance, ITokensTfaEmailAttributes>;
