import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";

import {Stuff} from "./stuff";

@Table({
  freezeTableName: true,
  tableName: "stuff_translations",
})
export class StuffTranslation extends Model<StuffTranslation> {
  @Column({
    field: "stuff_id",
    primaryKey: true,
    type: DataType.BIGINT,
  })
  @ForeignKey(() => Stuff)
  public stuffId!: string;

  @Column({
    primaryKey: true,
    type: "LANGUAGE_CODE",
  })
  public code!: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  public title!: string;

  @Column({
    allowNull: false,
    defaultValue: "",
    type: DataType.TEXT,
  })
  public description!: string;

  @BelongsTo(() => Stuff)
  public stuff!: Stuff;
}
