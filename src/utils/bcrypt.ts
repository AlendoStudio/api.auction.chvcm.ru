import * as bcrypt from "bcrypt";

import {Const} from "../const";

/**
 * Bcrypt
 */
export class Bcrypt {
  /**
   * Hash password
   * @param {string} password Password
   * @return {Promise<string>}
   * @throws Error
   */
  public static async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, Const.BCRYPT_SALT_ROUNDS);
  }

  /**
   * Compare password and hash
   * @param {string | null} password Password
   * @param {string | null} hash Hash
   * @return {Promise<boolean>}
   * @throws Error
   */
  public static async compare(password?: string | null, hash?: string | null): Promise<boolean> {
    if (!password || !hash) {
      return false;
    }
    return await bcrypt.compare(password, hash);
  }
}
