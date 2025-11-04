import { z } from "zod";

export const productSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    price: z.number().min(0),
    tags: z.string().array()
});


// For update (PATCH)
export const updateProductSchema = productSchema.partial();