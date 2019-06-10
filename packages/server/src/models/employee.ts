import {Column, DataType, Model, Table} from "sequelize-typescript";

@Table({
  freezeTableName: true,
  tableName: "employees",
})
export class Employee extends Model<Employee> {
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
    defaultValue: false,
    type: DataType.BOOLEAN,
  })
  public admin!: boolean;

  @Column({
    allowNull: false,
    defaultValue: false,
    type: DataType.BOOLEAN,
  })
  public moderator!: boolean;
}
