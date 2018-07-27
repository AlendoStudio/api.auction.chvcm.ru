import * as SuperSequelize from "sequelize";

export interface IStuffTranslation {
  title: string;
}

export interface IStuffTranslationsAttributes {
  readonly stuffid?: string;
  readonly code?: string;
  readonly translation?: IStuffTranslation;
}

export type IStuffTranslationsInstance =
  SuperSequelize.Instance<IStuffTranslationsAttributes> & IStuffTranslationsAttributes;

export type IStuffTranslationsModel = SuperSequelize.Model<IStuffTranslationsInstance, IStuffTranslationsAttributes>;
