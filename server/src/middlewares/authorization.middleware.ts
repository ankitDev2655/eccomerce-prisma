import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized.exceptions";
import { ErrorCode, ErrorMessage } from "../exceptions/root.exceptions";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/secret";
import { prismaClient } from "../config/prisma";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    //1. Extract the token from header 

    const token = req.headers.authorization?.split(" ")[1];

    //2. If token is not present, throw an error of unauthorized
    if (!token) {
        next(new UnauthorizedException(ErrorMessage.UNAUTHORIZED, ErrorCode.UNAUTHORIZED));
        return;
    }
    

    try {
        //3 If the token is present, verify that token and extract the payload
        const payload = jwt.verify(
            token,
            JWT_SECRET as jwt.Secret
        ) as any;

        //4. to get the user from the payload
        const user = await prismaClient.user.findFirst({ where: { id: payload.userId } });
        if (!user) {
            next(new UnauthorizedException(ErrorMessage.UNAUTHORIZED, ErrorCode.UNAUTHORIZED));
            return;
        }

        //5. to attach the user to the current request object
        // (req as any).user = user;
        req.user = user;
        next();
    } catch (error) {
        next(new UnauthorizedException(ErrorMessage.UNAUTHORIZED, ErrorCode.UNAUTHORIZED));
        return;
    }


    //5. to attach the user to the current request object
}


export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if(user.role !== 'ADMIN'){
        next(new UnauthorizedException(ErrorMessage.ADMIN_ONLY_ACCESS, ErrorCode.ADMIN_ONLY_ACCESS));
        return;
    }

    next();
}

