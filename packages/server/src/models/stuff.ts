import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";

import {Lot} from "./lot";
import {StuffTranslation} from "./stuffTranslation";

@Table({
  freezeTableName: true,
  tableName: "stuffs",
})
export class Stuff extends Model<Stuff> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    field: "amount_type",
    type: "AMOUNT_TYPE",
  })
  public amountType!: string;

  @Column({
    allowNull: false,
    defaultValue: true,
    type: DataType.BOOLEAN,
  })
  public enabled!: boolean;

  @HasMany(() => Lot)
  public lots!: Lot[];

  @HasMany(() => StuffTranslation)
  public translations!: StuffTranslation[];
}
