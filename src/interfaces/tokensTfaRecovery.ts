import * as SuperSequelize from "sequelize";

export interface ITokensTfaRecoveryAttributes {
  readonly token?: string;
  readonly userid?: string;
}

export type ITokensTfaRecoveryInstance =
  SuperSequelize.Instance<ITokensTfaRecoveryAttributes> & ITokensTfaRecoveryAttributes;

export type ITokensTfaRecoveryModel = SuperSequelize.Model<ITokensTfaRecoveryInstance, ITokensTfaRecoveryAttributes>;
