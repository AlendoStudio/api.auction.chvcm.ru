import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";

import {Lot} from "./lot";

@Table({
  freezeTableName: true,
  tableName: "entities",
})
export class Entity extends Model<Entity> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  public name!: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
    unique: true,
  })
  public email!: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
    unique: true,
  })
  public phone!: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  public password!: string | null;

  @Column({
    allowNull: false,
    defaultValue: false,
    type: DataType.BOOLEAN,
  })
  public tfa!: boolean;

  @Column({
    allowNull: false,
    type: "LANGUAGE_CODE",
  })
  public language!: string;

  @Column({
    allowNull: false,
    defaultValue: false,
    type: DataType.BOOLEAN,
  })
  public banned!: boolean;

  @Column({
    allowNull: false,
    defaultValue: DataType.NOW,
    type: DataType.DATE,
  })
  public registration!: Date;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  public ceo!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
    unique: true,
  })
  public psrn!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
    unique: true,
  })
  public itn!: string;

  @Column({
    allowNull: false,
    defaultValue: false,
    type: DataType.BOOLEAN,
  })
  public verified!: boolean;

  @HasMany(() => Lot)
  public winningLots!: Lot[];
}
