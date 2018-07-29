import {IResponseChainContext, ResponseChain as SuperResponseChain} from "@alendo/express-res-chain";
import {NextFunction, Request, Response} from "express";

import {ApiCodes} from "../apiCodes";

/**
 * Response chain
 */
export class ResponseChain extends SuperResponseChain<ResponseChain> {
  /**
   * Middleware for express
   */
  public static middleware() {
    return (req: Request, res: Response, next?: NextFunction) => {
      SuperResponseChain.middleware(ResponseChain)(req, res, () => {
        res.achain = res.chain as any;
        if (next) {
          next();
        }
      });
    };
  }

  /**
   * Error handler middleware
   * @param error Error
   * @param req Request
   * @param res Response
   * @param next Next function
   */
  public static async errorHandlerMiddleware(error: Error & { statusCode: number; },
                                             req: Request, res: Response, next?: NextFunction) {
    await res.achain
      .check(() => {
        return error.statusCode !== 413;
      }, ApiCodes.PAYLOAD_TOO_LARGE_ERROR, "payload too large error", 413)
      .action(() => {
        throw error;
      })
      .execute(next);
  }

  /**
   * Add render action to chain
   * @param {string} view View
   * @param options Options
   * @return {this}
   */
  public render(view: string, options?: any): this {
    return this.action(() => {
      return new Promise<void>((resolve, reject) => {
        this.res.render(view, options, (error: Error, html: string) => {
          if (error) {
            reject(error);
          } else {
            this.res.type("text/html");
            this.res.status(200).send(html);
            resolve();
          }
        });
      });
    });
  }

  protected onError(context: IResponseChainContext, error?: Error) {
    super.onError(context, error);
    if (error) {
      // TODO: sentry.io (or raven.js) here
    }
  }
}
