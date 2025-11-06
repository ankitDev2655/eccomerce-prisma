import { NextFunction, Request, Response } from "express";
import { AddCartItemSchema, changeItemQuantitySchema } from "../schema/cart.schema";
import { NotFoundException } from "../exceptions/not-found.exception";
import { ErrorCode, ErrorMessage } from "../exceptions/root.exceptions";
import { Products } from "../generated/prisma";
import { prismaClient } from "../config/prisma";
import { BadRequestException } from "../exceptions/bad-requests.exceptions";

export const addItemToCart = async (req: Request, res: Response, next: NextFunction) => {
    const validateData = AddCartItemSchema.parse(req.body);
    let product: Products;
    try {
        product = await prismaClient.products.findFirstOrThrow({
            where:{
                id: validateData.productId
            }
        })
    } catch (error) {
        throw new NotFoundException(ErrorMessage.PRODUCT_NOT_FOUND, ErrorCode.PRODUCT_NOT_FOUND);
    }

    const cartItem = await prismaClient.cartItems.create({
        data:{
            userId: (req.user as any).id,
            productId: product.id,
            quantity: validateData.quantity
        }
    })

    res.status(201).json({
        success: true,
        message: 'Item added to cart successfully',
        data: cartItem
    }); 
};

export const deleteItemFromCart = async (req: Request, res: Response, next: NextFunction) => {
    await prismaClient.cartItems.delete({
        where:{
            id: Number(req.params.id),
            userId: (req.user as any).id
        }
    });

    res.status(200).json({
        success: true,
        message: 'Item deleted from cart successfully'
    });
};


export const getCartItems = async (req: Request, res: Response, next: NextFunction) => {
    const cartItems = await prismaClient.cartItems.findMany({
        where: {
            userId: (req.user as any).id
        },
        include: {
            product: {
                select:{
                    "id": true,
                    "name": true,
                    "description": true,
                    "price": true
                }
            }
        }
    });

    res.status(200).json({
        success: true,
        message: 'Cart items fetched successfully',
        data: cartItems
    });
};


export const changeItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
    const validateData = changeItemQuantitySchema.parse(req.body);
    const { quantity } = validateData;

    if (!quantity || quantity <= 0) {
        throw new BadRequestException(
            "Invalid quantity",
            ErrorCode.VALIDATION_ERROR
        );
    }

    const cartItem = await prismaClient.cartItems.findFirst({
        where: {
            id: Number(req.params.id),
            userId: (req.user as any).id
        }
    });

    console.log(cartItem)
    if (!cartItem) {
        throw new NotFoundException(
            ErrorMessage.CART_ITEM_NOT_FOUND,
            ErrorCode.CART_ITEM_NOT_FOUND
        );
    }

    const updatedCartItem = await prismaClient.cartItems.update({
        where: { id: cartItem.id },
        data: { quantity },
        include:{
            product: {
                select:{
                    "id": true,
                    "name": true,
                    "description": true,
                    "price": true
                }
            }
        }
    });

    res.status(200).json({
        success: true,
        message: 'Cart item quantity updated successfully',
        data: updatedCartItem
    });
}; 