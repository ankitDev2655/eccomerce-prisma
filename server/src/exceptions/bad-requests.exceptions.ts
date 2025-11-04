import { ErrorCode, HttpException } from "./root.exceptions";

export class BadRequestException extends HttpException {
    constructor(message: string, errorCode: ErrorCode, error?: any) {
        super(message, 400, errorCode, error);
    }
}
