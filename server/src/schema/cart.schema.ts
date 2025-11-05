import {z} from "zod";

export const AddCartItemSchema = z.object({
    productId: z.number().min(1, "Product ID is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
});


export const changeItemQuantitySchema = z.object({
    quantity: z.number().min(1, "Quantity must be at least 1"),
});