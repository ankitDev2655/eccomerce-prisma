import { NextFunction, Request, Response } from "express"
import { ErrorCode, ErrorMessage, HttpException } from "./root.exceptions";
import { InternalException } from "./internal.exceptions";
import { ZodError } from "zod";
import { BadRequestException } from "./bad-requests.exceptions";

export const errorHandler = (method: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await method(req, res, next);
        } catch (error: any) {
            let exception: HttpException;
            if (error instanceof HttpException) {
                exception = error;
            }
            else {
                if (error instanceof ZodError) {
                    exception = new BadRequestException('Unprocessable Entity', ErrorCode.UNPROCESSABLE_ENTITY, error.issues)
                }
                else {
                    exception = new InternalException(ErrorMessage.INTERNAL_SERVER_ERROR, error, ErrorCode.INTERNAL_SERVER_ERROR)
                }
            }
            next(exception);
        }
    }
}