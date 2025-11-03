import { HttpException } from "./root.exceptions";

export class InternalException extends HttpException {
    constructor(message: string, errors: any, errorCode: number) {
        super(message, 500, errorCode, errors);
    }
}