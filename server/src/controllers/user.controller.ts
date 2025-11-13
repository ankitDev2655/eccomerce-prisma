import { Request, Response, NextFunction } from 'express';
import { AddressSchema, UpdateUserProfileSchema, UpdateUserRole } from '../schema/user.schema';
import { NotFoundException } from '../exceptions/not-found.exception';
import { ErrorCode, ErrorMessage } from '../exceptions/root.exceptions';
import { Address, User } from '../generated/prisma';
import { prismaClient } from '../config/prisma';
import { count } from 'console';
import { BadRequestException } from '../exceptions/bad-requests.exceptions';

export const addAddress = async (req: Request, res: Response, next: NextFunction) => {
    AddressSchema.parse(req.body);

    const user = req.user as User;

    const address = await prismaClient.address.create({
        data: {
            ...req.body,
            userId: user.id
        }
    });

    res.status(201).json({
        success: true,
        message: 'Address added successfully',
        data: address
    });
}

export const listAddresses = async (req: Request, res: Response, next: NextFunction) => {
    const addresses = await prismaClient.address.findMany({
        where: {
            userId: (req.user as User).id
        }
    });

    res.status(200).json({
        success: true,
        count: addresses.length,
        data: addresses
    });
}


export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await prismaClient.address.delete({
            where: {
                id: Number(req.params.id)
            }
        })

        res.status(200).json({
            success: true,
            message: 'Address deleted successfully'
        });
    } catch (error) {
        throw new NotFoundException(ErrorMessage.ADDRESS_NOT_FOUND, ErrorCode.ADDRESS_NOT_FOUND);
    }
}


export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    const validateData: any = UpdateUserProfileSchema.parse(req.body);
    let shippingAddress: Address;
    let billingAddress: Address;

    if (validateData.defaultShippingAddressId) {
        try {
            shippingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: Number(validateData.defaultShippingAddressId),
                    userId: (req.user as User).id
                }
            });
        } catch (error) {
            throw new NotFoundException(ErrorMessage.ADDRESS_NOT_FOUND, ErrorCode.ADDRESS_NOT_FOUND);
        }
    }

    if (validateData.defaultBillingAddressId) {
        try {
            billingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: Number(validateData.defaultBillingAddressId),
                    userId: (req.user as User).id
                }
            });
        } catch (error) {
            throw new NotFoundException(ErrorMessage.ADDRESS_NOT_FOUND, ErrorCode.ADDRESS_NOT_FOUND);
        }
    }


    const updateduser = await prismaClient.user.update({
        where: {
            id: (req.user as User).id
        },
        data: validateData
    });

    res.status(200).json({
        success: true,
        message: 'User profile updated successfully',
        data: updateduser
    });
}



// -------------------------------------

export const listUsers = async (req: Request, res: Response, next: NextFunction) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.count) || 5;

    if (page <= 0 || limit <= 0) {
        throw new BadRequestException(
            "Page and limit must be positive numbers",
            ErrorCode.VALIDATION_ERROR
        );
    }

    const totalUser = await prismaClient.user.count();

    const users = await prismaClient.user.findMany({
        skip: (page - 1) * limit,
        take: limit
    })

    // 4️⃣ Send response
    res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: {
            total: totalUser,
            page,
            limit,
            users,
        },
    });

}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await prismaClient.user.findFirstOrThrow({
            where: {
                id: Number(req.params.id)
            },
            include: {
                addresses: true,
                CartItems: true,
                Order: true
            }
        })

        res.status(200).json({
            success: true,
            message: "User Fetched Successfully",
            user
        })
    } catch (error) {
        throw new NotFoundException(ErrorMessage.USER_NOT_FOUND, ErrorCode.USER_NOT_FOUND);
    }
}

export const changeUserRole = async (req: Request, res: Response, next: NextFunction) => { 
    UpdateUserRole.parse(req.body);
    try {
        const user = await prismaClient.user.update({
            where: {
                id: Number(req.params.id)
            },
            data:{
                role: req.body.role
            },
            include: {
                addresses: true,
                CartItems: true,
                Order: true
            }
        })

        res.status(200).json({
            success: true,
            message: "User Fetched Successfully",
            user
        })
    } catch (error) {
        throw new NotFoundException(ErrorMessage.USER_NOT_FOUND, ErrorCode.USER_NOT_FOUND);
    }
}

