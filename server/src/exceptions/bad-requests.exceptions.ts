import { ErrorCode, HttpException } from "./root.exceptions";

export class BadRequestException extends HttpException {
    constructor(message: string, errorCode: ErrorCode) {
        super(message, 400, errorCode, null);
    }
}
