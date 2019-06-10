import {NextFunction, Request, Response} from "express";
import {HttpError} from "http-errors";

import {debug4xx, debug5xx} from "../utils";

export function errorHandler(
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (error.status >= 500) {
    debug5xx(error);
  } else {
    debug4xx(error);
  }

  if (!res.headersSent) {
    res.status(error.status).json({
      code: error.code,
      message: error.message,
    });
  }
}
