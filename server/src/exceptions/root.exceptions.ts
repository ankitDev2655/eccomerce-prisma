// ======================================================
// 🌐 Base HTTP Exception Class
// ======================================================

export class HttpException extends Error {
    message: string;                 // Human-readable error message
    errorCode: ErrorCode | undefined; // Machine-friendly numeric code
    statusCode: number;               // HTTP status code
    errors: any[] | null = [];        // Optional array of detailed errors (e.g., validation issues)

    constructor(
        message: string,
        statusCode: number,
        errorCode?: ErrorCode,
        errors: any[] | null = []
    ) {
        super(message);                // Call the built-in Error constructor
        this.message = message;        // Set the message
        this.statusCode = statusCode;  // Set the HTTP status code (e.g., 400, 404, 500)
        this.errorCode = errorCode;    // Set the machine-readable error code
        this.errors = errors;          // Optional detailed error info
    }
}



// ======================================================
// 💬 Error Messages — Human / Developer Readable Strings
// ======================================================
export enum ErrorMessage {
    // ------------------- User / Auth Errors (1000 range) -------------------
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
    ADDRESS_NOT_FOUND = 'ADDRESS_NOT_FOUND',

    // ------------------- Validation & Server Errors -----------------------
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',

    // ------------------- Authorization Errors -----------------------------
    UNAUTHORIZED = 'UNAUTHORIZED', // No token or invalid token
    FORBIDDEN = 'FORBIDDEN',       // Not allowed to access a resource
    ADMIN_ONLY_ACCESS = 'ADMIN_ONLY_ACCESS', // Restricted to admin roles only

    // ------------------- Product / E-commerce Errors ----------------------
    PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
    PRODUCT_ALREADY_EXISTS = 'PRODUCT_ALREADY_EXISTS',


    // ------------------- Cart Errors ----------------------
    CART_ITEM_NOT_FOUND = 'CART_ITEM_NOT_FOUND',


    // ------------------- Order------------------------
    ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',
    ORDER_ALREADY_EXISTS = 'ORDER_ALREADY_EXISTS',

}



// ======================================================
// 🔢 Error Codes — Machine / Log Friendly Numeric Codes
// ======================================================
export enum ErrorCode {
    // ------------------- User / Auth Errors (1000–1999) -------------------
    USER_NOT_FOUND = 1001,
    INVALID_CREDENTIALS = 1002,
    USER_ALREADY_EXISTS = 1003,
    ADDRESS_NOT_FOUND = 1007,

    // ------------------- Validation & General Errors (1004–1099) ----------
    VALIDATION_ERROR = 1004,
    INTERNAL_SERVER_ERROR = 1005,
    UNPROCESSABLE_ENTITY = 1006,   // Zod validation / schema errors

    // ------------------- Authorization Errors (1100–1199) -----------------
    UNAUTHORIZED = 1101,
    FORBIDDEN = 1102,
    ADMIN_ONLY_ACCESS = 1103,

    // ------------------- Product / E-commerce Errors (2000–2999) ----------
    PRODUCT_NOT_FOUND = 2001,
    PRODUCT_ALREADY_EXISTS = 2002,

    //------------------- Cart Errors (3000–3999) ----------------------
    CART_ITEM_NOT_FOUND = 3001,

    // ------------------- Order Errors (4000-4999) ------------------------
    ORDER_NOT_FOUND = 4001,
    ORDER_ALREADY_EXISTS = 2002,
}
