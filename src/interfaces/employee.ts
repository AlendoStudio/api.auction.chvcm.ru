import * as SuperSequelize from "sequelize";

import {IUserCommonAttributes} from "./user";

export interface IEmployeeAttributes extends IUserCommonAttributes {
  readonly admin?: boolean;
  readonly moderator?: boolean;
}

export type IEmployeeInstance = SuperSequelize.Instance<IEmployeeAttributes> & IEmployeeAttributes;

export type IEmployeeModel = SuperSequelize.Model<IEmployeeInstance, IEmployeeAttributes>;
