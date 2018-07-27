import {IPostgresInterval} from "postgres-interval";
import * as SuperSequelize from "sequelize";

export interface ILotAttributes {
  readonly id?: string;
  readonly stuffid?: string;
  readonly type?: string;
  readonly amount?: string;
  readonly amount_type?: string;
  readonly start?: Date;
  readonly finish?: Date;
  readonly buffer?: IPostgresInterval;
  readonly startbid?: string;
  readonly step?: string;
  readonly currency?: string;
  readonly participants?: string;
  readonly winbid?: string | null;
  readonly winner?: string | null;
}

export type ILotInstance = SuperSequelize.Instance<ILotAttributes> & ILotAttributes;

export type ILotModel = SuperSequelize.Model<ILotInstance, ILotAttributes>;
