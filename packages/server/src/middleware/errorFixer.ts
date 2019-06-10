import {isCelebrate} from "celebrate";
import {NextFunction, Request, Response} from "express";
import {HttpError} from "http-errors";

import {ApiCodes} from "../apiCodes";

function getCodeForStatus(status: number): string {
  switch (status) {
    case 400:
      return ApiCodes.BAD_REQUEST;
    case 413:
      return ApiCodes.PAYLOAD_TOO_LARGE;
    case 500:
      return ApiCodes.INTERNAL_SERVER_ERROR;
    default:
      return ApiCodes.UNKNOWN_CODE;
  }
}

export function errorFixer(
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  error.status = isCelebrate(error)
    ? 400
    : error.statusCode || error.status || 500;
  error.code = error.code || getCodeForStatus(error.status);

  next(error);
}
