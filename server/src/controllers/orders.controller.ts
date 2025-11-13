import { Request, Response, NextFunction } from "express";
import { prismaClient } from "../config/prisma";
import { NotFoundException } from "../exceptions/not-found.exception";
import { ErrorCode, ErrorMessage } from "../exceptions/root.exceptions";
import { BadRequestException } from "../exceptions/bad-requests.exceptions";

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    // 1. Create a transaction 
    // 2. TO list all cart Items and proceed if the cart is not empty
    // 3. calculate the total amount
    // 4. Fetch Address of User
    // 5. to define computed field for formatted address on address model in prisma schema
    // 6. we will create order and order productsorder products
    // 7. create events 
    // 8. To empty the cart 


    return await prismaClient.$transaction(async (ts) => {
        const cartItems = await ts.cartItems.findMany({
            where: {
                userId: (req.user as any).id
            },
            include: {
                product: {
                    select: {
                        "id": true,
                        "price": true,
                        "name": true,
                        "description": true
                    }
                }
            }
        });

        if (cartItems.length === 0) {
            res.json({
                success: false,
                message: "Cart is empty"
            })
        };

        const price = cartItems.reduce((total, item) => {
            return total + (item.quantity * Number(item.product.price))
        }, 0);

        const address = await ts.address.findFirst({
            where: {
                id: (req.user as any).defaultShippingAddressId
            }
        });

        const order = await ts.order.create({
            data: {
                userId: (req.user as any).id,
                total: price,
                netAmount: price,
                address: address?.formattedAddress || "No address found",
                OrderProducts: {
                    create: cartItems.map((item) => {
                        return {
                            productId: item.productId,
                            quantity: item.quantity
                        }
                    })
                }
            }
        });


        const orderEvent = await ts.orderEvents.create({
            data: {
                orderId: order.id,
                status: "CREATED"
            }
        })

        ts.cartItems.deleteMany({
            where: {
                userId: (req.user as any).id
            }
        });

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: order,
            orderEvent: orderEvent
        })
    })

}


export const listOrders = async (req: Request, res: Response, next: NextFunction) => {
    const orders = await prismaClient.order.findMany({
        where: {
            userId: (req.user as any).id,
        }
    });

    res.status(200).json({
        success: true,
        message: "Order fetched successfully",
        data: orders
    })
}


export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await prismaClient.order.findFirstOrThrow({
            where: {
                id: Number(req.params.id)
            },
            include: {
                OrderProducts: true,
                OrderEvents: true
            }
        });

        res.status(200).json({
            success: true,
            message: "Order Fetched Successfully",
            data: order
        })
    } catch (error) {
        throw new NotFoundException(ErrorMessage.ORDER_NOT_FOUND, ErrorCode.ORDER_NOT_FOUND);
    }
}


export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = Number(req.params.id);

    if (isNaN(orderId)) {
        return next(new BadRequestException("Invalid order ID", ErrorCode.VALIDATION_ERROR));
    }

    try {
        const result = await prismaClient.$transaction(async (tx) => {
            // Update order status
            const order = await tx.order.update({
                where: {
                    id: orderId,
                    userId: (req.user as any).id
                },
                data: { status: "CANCELLED" }
            });

            // Create order event
            await tx.orderEvents.create({
                data: {
                    orderId: order.id,
                    status: "CANCELLED"
                }
            });

            return order;
        });

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: result
        });
    } catch (error: any) {
        // Prisma throws an error if the record doesn't exist
        if (error.code === "P2025") {
            return next(new NotFoundException(ErrorMessage.ORDER_NOT_FOUND, ErrorCode.ORDER_NOT_FOUND));
        }
    }
};


export const listAllOrders = async (req: Request, res: Response, next: NextFunction) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    if (page <= 0 || limit <= 0) {
        throw new BadRequestException(
            "Page and Limit should be positive number",
            ErrorCode.VALIDATION_ERROR
        )
    }

    let whereClause = {};
    const status = req.query.status;
    if (status) {
        whereClause = {
            status
        }
    };

    const totalOrder = await prismaClient.order.count();

    const orders = await prismaClient.order.findMany({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        include: {
            OrderProducts: true,
            OrderEvents: true
        }
    });

    res.status(200).json({
        success: true,
        message: "Order fetched successfully",
        data: {
            total: totalOrder,
            page,
            limit,
            orders,
        },
    })
}


export const changeStatus = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = Number(req.params.id);
    const { status } = req.body

    if (isNaN(orderId)) {
        return next(new BadRequestException("Invalid order ID", ErrorCode.VALIDATION_ERROR));
    }
    try {

        const result = await prismaClient.$transaction(async (tx) => {

            const order = await tx.order.update({
                where: {
                    id: orderId
                },
                data: {
                    status: status
                }
            })

            const orderEvent = await tx.orderEvents.create({
                data: {
                    status: status,
                    orderId: orderId
                }
            })

            return { order, orderEvent }
        })

        res.status(200).json({
            success: true,
            message: `Status Changed successfully to ${status}`,
            data: result
        })


    } catch (error) {
        throw new NotFoundException(ErrorMessage.ORDER_NOT_FOUND, ErrorCode.ORDER_NOT_FOUND);
    }
}


export const listUserOrders = async (req: Request, res: Response, next: NextFunction) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    if (page <= 0 || limit <= 0) {
        throw new BadRequestException(
            "Page and Limit should be positive number",
            ErrorCode.VALIDATION_ERROR
        )
    }

    let whereClause = {};
    const userId = Number(req.params.userId);
    if (!userId) {
        throw new BadRequestException(
            "User Id is required",
            ErrorCode.VALIDATION_ERROR
        )
    }
    if (userId) {
        whereClause = {
            userId
        }
    };
    const status = req.query.status;
    if (status) {
        whereClause = {
            ...whereClause,
            status
        }
    };


    const orders = await prismaClient.order.findMany({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        include: {
            OrderProducts: true,
            OrderEvents: true
        }
    });

    res.status(200).json({
        success: true,
        message: "Order fetched successfully",
        data: {
            total: orders.length,
            page,
            limit,
            orders,
        },
    })
}

