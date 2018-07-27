import * as SuperSequelize from "sequelize";

import {ITokensTfaRecoveryAttributes} from "./tokensTfaRecovery";

export interface ITokensTfaPurgatoryAttributes extends ITokensTfaRecoveryAttributes {
  readonly expires?: Date;
}

export type ITokensTfaPurgatoryInstance =
  SuperSequelize.Instance<ITokensTfaPurgatoryAttributes> & ITokensTfaPurgatoryAttributes;

export type ITokensTfaPurgatoryModel = SuperSequelize.Model<ITokensTfaPurgatoryInstance, ITokensTfaPurgatoryAttributes>;
