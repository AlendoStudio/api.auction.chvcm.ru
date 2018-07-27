import * as SuperSequelize from "sequelize";

export interface ILotParticipantsAttributes {
  readonly lotid?: string;
  readonly userid?: string;
}

export type ILotParticipantsInstance = SuperSequelize.Instance<ILotParticipantsAttributes> & ILotParticipantsAttributes;

export type ILotParticipantsModel = SuperSequelize.Model<ILotParticipantsInstance, ILotParticipantsAttributes>;
