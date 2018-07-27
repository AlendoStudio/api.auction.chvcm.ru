import * as SuperSequelize from "sequelize";

import {ITokensTfaRecoveryAttributes} from "./tokensTfaRecovery";

export interface ITokensPasswordResetAttributes extends ITokensTfaRecoveryAttributes {
  readonly expires?: Date;
}

export type ITokensPasswordResetInstance =
  SuperSequelize.Instance<ITokensPasswordResetAttributes> & ITokensPasswordResetAttributes;

export type ITokensPasswordResetModel =
  SuperSequelize.Model<ITokensPasswordResetInstance, ITokensPasswordResetAttributes>;
