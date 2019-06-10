import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";

import {User} from "./user";

@Table({
  freezeTableName: true,
  tableName: "tokens_tfa_otp",
})
export class TokenTfaOtp extends Model<TokenTfaOtp> {
  @Column({
    field: "user_id",
    primaryKey: true,
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  public userId!: string;

  @Column({
    allowNull: false,
    type: "OTP_TYPE",
  })
  public type!: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  public token!: string;

  @BelongsTo(() => User)
  public user!: User;
}
