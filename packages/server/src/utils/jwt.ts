import * as util from "util";

import * as jwt from "jsonwebtoken";

import {Const} from "../const";
import {Env} from "../env";
import {ISignUser} from "../interfaces";

/**
 * JSON Web Token
 */
export class Jwt {
  /**
   * Sign User
   * @param user User data for sign
   * @throws Error
   */
  public static async signUser(user: ISignUser): Promise<string> {
    return await util.promisify<string>((callback) =>
      jwt.sign(
        {
          id: user.id,
          type: user.type,
        },
        Env.JWT_SECRET,
        {
          algorithm: Const.JWT_ALGORITHM,
          expiresIn: Const.JWT_EXPIRESIN,
        },
        callback,
      ),
    )();
  }

  /**
   * Verify user
   * @param token Token
   * @throws Error
   */
  public static async verifyUser(token: string): Promise<ISignUser> {
    const {id, type} = (await util.promisify<unknown>((callback) =>
      jwt.verify(
        token,
        Env.JWT_SECRET,
        {
          algorithms: Const.JWT_ALGORITHMS,
        },
        callback,
      ),
    )()) as ISignUser;
    return {
      id,
      type,
    };
  }
}
