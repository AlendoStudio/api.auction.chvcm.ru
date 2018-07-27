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
   * @param {ISignUser} user User data for sign
   * @return {Promise<string>}
   * @throws Error
   */
  public static async signUser(user: ISignUser) {
    return await Jwt.sign({
      id: user.id,
      type: user.type,
    });
  }

  /**
   * Verify user
   * @param {string} token Token
   * @return {Promise<ISignUser>}
   * @throws Error
   */
  public static async verifyUser(token: string): Promise<ISignUser> {
    const user = await Jwt.verify<ISignUser>(token);
    return {
      id: user.id,
      type: user.type,
    };
  }

  private static sign(payload: object): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(payload, Env.JWT_SECRET, {
        algorithm: Const.JWT_ALGORITHM,
        expiresIn: Const.JWT_EXPIRESIN,
      }, (error: Error, token: string) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      });
    });
  }

  private static verify<T>(token: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      jwt.verify(token, Env.JWT_SECRET, {
        algorithms: Const.JWT_ALGORITHMS,
      }, (error, decoded) => {
        if (error) {
          reject(error);
        } else {
          resolve(decoded as any);
        }
      });
    });
  }
}
