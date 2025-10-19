import { z } from "zod";

export const createReviewValidationSchema = z.object({
  body: z.object({
    user: z.string().nonempty("User ID is required"),
    product: z.string().nonempty("Product ID is required"),
    rating: z.number().min(1).max(5),
    description: z.string().optional(),
  }),
});

export const updateReviewValidationSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5).optional(),
    description: z.string().optional(),
    status: z.enum(["pending", "approved", "rejected"]).optional(),
  }),
});
