import {IPostgresInterval} from "postgres-interval";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";

import {Entity} from "./entity";
import {Stuff} from "./stuff";

@Table({
  freezeTableName: true,
  tableName: "lots",
})
export class Lot extends Model<Lot> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    field: "stuff_id",
    type: DataType.BIGINT,
  })
  @ForeignKey(() => Stuff)
  public stuffId!: string;

  @Column({
    allowNull: false,
    type: "LOT_TYPE",
  })
  public type!: string;

  @Column({
    allowNull: false,
    type: DataType.DECIMAL,
  })
  public amount!: string;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  public start!: Date;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  public finish!: Date;

  @Column({
    allowNull: false,
    type: "INTERVAL",
  })
  public buffer!: IPostgresInterval;

  @Column({
    allowNull: false,
    field: "start_bid",
    type: DataType.DECIMAL,
  })
  public startBid!: string;

  @Column({
    allowNull: false,
    type: DataType.DECIMAL,
  })
  public step!: string;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
  })
  public strict!: boolean;

  @Column({
    allowNull: false,
    type: "CURRENCY",
  })
  public currency!: boolean;

  @Column({
    allowNull: false,
    defaultValue: "0",
    type: DataType.BIGINT,
  })
  public participants!: string;

  @Column({
    allowNull: true,
    field: "winner_bid",
    type: DataType.DECIMAL,
  })
  public winnerBid!: string | null;

  @Column({
    allowNull: true,
    field: "winner_id",
    type: DataType.BIGINT,
  })
  @ForeignKey(() => Entity)
  public winnerId!: string | null;

  @BelongsTo(() => Stuff)
  public stuff!: Stuff;

  @BelongsTo(() => Entity)
  public winner!: Entity;
}
