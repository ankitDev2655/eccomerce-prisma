import { ErrorCode, HttpException } from "./root.exceptions";

export class UnauthorizedException extends HttpException {
    constructor(message: string, errorCode: ErrorCode, errors?: any) {
        super(message, 401, errorCode, errors);
    }
}
