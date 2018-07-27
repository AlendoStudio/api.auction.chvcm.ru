import * as SuperSequelize from "sequelize";

export interface IAttachmentAttributes {
  readonly userid?: string;
  readonly url?: string;
}

export type IAttachmentInstance = SuperSequelize.Instance<IAttachmentAttributes> & IAttachmentAttributes;

export type IAttachmentModel = SuperSequelize.Model<IAttachmentInstance, IAttachmentAttributes>;
