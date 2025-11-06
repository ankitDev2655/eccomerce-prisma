import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../config/prisma";
import { productSchema, updateProductSchema } from "../schema/product.schema";
import { NotFoundException } from "../exceptions/not-found.exception";
import { ErrorCode, ErrorMessage } from "../exceptions/root.exceptions";
import { BadRequestException } from "../exceptions/bad-requests.exceptions";

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    const products = await prismaClient.products.findMany();

    res.status(200).json({
        success: true,
        message: "List of products",
        products: products
    });
}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    productSchema.parse(req.body);

    const productExists = await prismaClient.products.findFirst({ where: { name: req.body.name } });
    if (productExists) {
        throw new BadRequestException(
            ErrorMessage.PRODUCT_ALREADY_EXISTS,
            ErrorCode.PRODUCT_ALREADY_EXISTS
        );
    }

    const product = await prismaClient.products.create({
        data: {
            ...req.body,
            tags: req.body.tags.join(",")
        }
    });
    res.status(201).json({
        success: true,
        message: "Product created successfully",
        product
    });
}

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        throw new BadRequestException(
            "Product ID is required",
            ErrorCode.VALIDATION_ERROR
        );
    }

    const productId = Number(req.params.id);

    const product = await prismaClient.products.findFirst({
        where: {
            id: productId
        }
    });

    if (!product) {
        throw new NotFoundException(
            ErrorMessage.PRODUCT_NOT_FOUND,
            ErrorCode.PRODUCT_NOT_FOUND
        )
    }

    res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        product
    })
}

export const updateProductById = async (req: Request, res: Response, next: NextFunction) => {
    // Validate input
    updateProductSchema.parse(req.body);

    if (!req.params.id) {
        throw new BadRequestException(
            "Product ID is required",
            ErrorCode.VALIDATION_ERROR
        );
    }

    const productId = Number(req.params.id);

    // Check existence
    const existingProduct = await prismaClient.products.findFirst({
        where: { id: productId },
    });

    if (!existingProduct) {
        throw new NotFoundException(
            ErrorMessage.PRODUCT_NOT_FOUND,
            ErrorCode.PRODUCT_NOT_FOUND
        );
    }

    // Format tags if provided
    const updatedData = {
        ...req.body,
        tags: req.body.tags ? req.body.tags.join(",") : existingProduct.tags,
    };

    const updatedProduct = await prismaClient.products.update({
        where: { id: productId },
        data: updatedData,
    });

    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
    });
};


export const deleteProductById = async (req: Request, res: Response, next: NextFunction) => {
    // 1️⃣ Validate product ID
    if (!req.params.id) {
        throw new BadRequestException(
            "Product ID is required",
            ErrorCode.VALIDATION_ERROR
        );
    }

    const productId = Number(req.params.id);

    // 2️⃣ Check if product exists
    const existingProduct = await prismaClient.products.findFirst({
        where: { id: productId },
    });

    if (!existingProduct) {
        throw new NotFoundException(
            ErrorMessage.PRODUCT_NOT_FOUND,
            ErrorCode.PRODUCT_NOT_FOUND
        );
    }

    // 3️⃣ Delete the product
    await prismaClient.products.delete({
        where: { id: productId },
    });

    // 4️⃣ Send success response
    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
};

export const listProducts = async (req: Request, res: Response, next: NextFunction) => {

    // 1️⃣ Extract and validate pagination parameters
    const page = Number(req.query.page) || 1;  // default: 1st page
    const limit = Number(req.query.limit) || 5; // default: 5 items per page

    if (page <= 0 || limit <= 0) {
        throw new BadRequestException(
            "Page and limit must be positive numbers",
            ErrorCode.VALIDATION_ERROR
        );
    }

    // 2️⃣ Count total number of products
    const totalProducts = await prismaClient.products.count();

    // 3️⃣ Fetch paginated products
    const products = await prismaClient.products.findMany({
        skip: (page - 1) * limit, // skip previous pages
        take: limit,              // limit number of results
        orderBy: { createdAt: "desc" } // sort latest first (optional)
    });

    // 4️⃣ Send response
    res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: {
            total: totalProducts,
            page,
            limit,
            products,
        },
    });
};

