import * as cuid from "cuid";
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
  tableName: "tokens_tfa_recovery",
})
export class TokenTfaRecovery extends Model<TokenTfaRecovery> {
  @Column({
    defaultValue() {
      return cuid();
    },
    primaryKey: true,
    type: DataType.TEXT,
  })
  public token!: string;

  @Column({
    allowNull: false,
    field: "user_id",
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  public userId!: string;

  @BelongsTo(() => User)
  public user!: User;
}
