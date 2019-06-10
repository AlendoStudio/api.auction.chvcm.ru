import {Sequelize as SuperSequelize} from "sequelize-typescript";

import {Env} from "./env";
import {
  Employee,
  Entity,
  Lot,
  Stuff,
  StuffTranslation,
  TokenPasswordReset,
  TokenTfaOtp,
  TokenTfaPurgatory,
  TokenTfaRecovery,
  User,
} from "./models";

/**
 * Sequelize
 */
export class Sequelize extends SuperSequelize {
  /**
   * Instantiate instance
   */
  public static instantiate(): void {
    Sequelize._instance = new Sequelize();
  }

  /**
   * Instance
   */
  public static get instance(): Sequelize {
    return Sequelize._instance;
  }

  private static _instance: Sequelize;

  private constructor() {
    super(Env.DATABASE_URL, {
      define: {
        timestamps: false,
      },
      dialect: "postgres",
      dialectOptions: {
        ssl: Env.DATABASE_SSL,
      },
      logging: false,
      models: [
        Employee,
        Entity,
        Lot,
        Stuff,
        StuffTranslation,
        TokenPasswordReset,
        TokenTfaOtp,
        TokenTfaPurgatory,
        TokenTfaRecovery,
        User,
      ],
      pool: {
        max: Env.DATABASE_POOL_MAX,
      },
    });
  }
}
