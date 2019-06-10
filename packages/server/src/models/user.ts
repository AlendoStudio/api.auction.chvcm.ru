import {
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
} from "sequelize-typescript";

import {TokenPasswordReset} from "./tokenPasswordReset";
import {TokenTfaOtp} from "./tokenTfaOtp";
import {TokenTfaPurgatory} from "./tokenTfaPurgatory";
import {TokenTfaRecovery} from "./tokenTfaRecovery";

@Table({
  freezeTableName: true,
  tableName: "users_common",
})
export class User extends Model<User> {
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
    type: "USER_TYPE",
  })
  public type!: string;

  @Column({
    allowNull: false,
    defaultValue: DataType.NOW,
    type: DataType.DATE,
  })
  public registration!: Date;

  @HasMany(() => TokenPasswordReset)
  public tokensPasswordReset!: TokenPasswordReset[];

  @HasOne(() => TokenTfaOtp)
  public tokensTfaOtp!: TokenTfaOtp;

  @HasMany(() => TokenTfaPurgatory)
  public tokensTfaPurgatory!: TokenTfaPurgatory[];

  @HasMany(() => TokenTfaRecovery)
  public tokensTfaRecovery!: TokenTfaRecovery[];
}
