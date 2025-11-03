import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../config/prisma";
import { hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { BCRYPT_SALT_ROUNDS, JWT_EXPIRES_IN, JWT_SECRET } from "../config/secret";
import { BadRequestException } from "../exceptions/bad-requests.exceptions";
import { ErrorCode, ErrorMessage } from "../exceptions/root.exceptions";
import { signUpSchema } from "../schema/user";
import { NotFoundException } from "../exceptions/not-found.exception";

const authController = {
    signup: async (req: Request, res: Response, next: NextFunction) => {
        signUpSchema.parse(req.body);
        const { email, password, name } = req.body;

        let user = await prismaClient.user.findFirst({ where: { email } });
        if (user) {
            return next(new BadRequestException(ErrorMessage.USER_ALREADY_EXISTS, ErrorCode.USER_ALREADY_EXISTS));
        }

        user = await prismaClient.user.create({
            data: {
                name,
                email,
                password: hashSync(password, BCRYPT_SALT_ROUNDS),
            }
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user
        });
    },

    login: async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        const user = await prismaClient.user.findFirst({ where: { email } });
        if (!user) throw new NotFoundException(ErrorMessage.USER_NOT_FOUND, ErrorCode.USER_NOT_FOUND);

        const isPasswordValid = compareSync(password, user.password);
        if (!isPasswordValid) throw new BadRequestException(ErrorMessage.INVALID_CREDENTIALS, ErrorCode.INVALID_CREDENTIALS)

        // In v9+, the "sign" method expects Secret like this:
        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET as jwt.Secret,
            { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
        );

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user,
            token
        });
    },

    logout: async (_req: Request, res: Response) => {
        res.send("Logout Page");
    },

    getCurrentUser: (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user) {
            throw new NotFoundException(ErrorMessage.USER_NOT_FOUND, ErrorCode.USER_NOT_FOUND);
        }

        res.status(200).json({
            success: true,
            user
        });
    }
};

export default authController;
