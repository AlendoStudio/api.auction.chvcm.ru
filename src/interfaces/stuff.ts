import * as SuperSequelize from "sequelize";

export interface IStuffAttributes {
  readonly id?: string;
  readonly enabled?: boolean;
}

export type IStuffInstance = SuperSequelize.Instance<IStuffAttributes> & IStuffAttributes;

export type IStuffModel = SuperSequelize.Model<IStuffInstance, IStuffAttributes>;
