export class HttpException extends Error {
    message: string;
    errorCode: ErrorCode | undefined;
    statusCode: number;
    errors: any[] | null;

    constructor(message: string, statusCode: number, errorCode?: ErrorCode, errors: any[] | null = []) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.errors = errors;
    }
}


export enum ErrorMessage {
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
    UNAUTHORIZED = 'UNAUTHORIZED'
}

export enum ErrorCode {
    USER_NOT_FOUND = 1001,
    INVALID_CREDENTIALS = 1002,
    USER_ALREADY_EXISTS = 1003,
    VALIDATION_ERROR = 1004,
    INTERNAL_SERVER_ERROR = 1005,
    UNPROCESSABLE_ENTITY = 1006,
    UNAUTHORIZED = 9001
}
