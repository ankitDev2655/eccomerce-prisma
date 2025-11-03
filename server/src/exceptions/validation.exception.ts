import { HttpException } from "./root.exceptions";

export class UnprocessableEntityException extends HttpException {
    constructor(error: any, message: string, errorCode: number) {
        super(message, 422, errorCode, error);
    }
}