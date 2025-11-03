import { Request, Response, NextFunction } from "express";
import { ErrorCode, HttpException } from "../exceptions/root.exceptions";

export const errorMiddleware = (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof HttpException ? err.statusCode : 500;
  const message = err instanceof HttpException ? err.message : "Internal Server Error";
  const errorCode = err instanceof HttpException ? err.errorCode ?? ErrorCode.INTERNAL_SERVER_ERROR : ErrorCode.INTERNAL_SERVER_ERROR;
  const errors = err instanceof HttpException ? err.errors ?? [] : [];

  res.status(statusCode).json({
    success: false,
    message,
    errorCode,
    errors,
  });
};
