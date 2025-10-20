"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReviewValidationSchema = exports.createReviewValidationSchema = void 0;
const zod_1 = require("zod");
exports.createReviewValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        user: zod_1.z.string().nonempty("User ID is required"),
        product: zod_1.z.string().nonempty("Product ID is required"),
        rating: zod_1.z.number().min(1).max(5),
        description: zod_1.z.string().optional(),
    }),
});
exports.updateReviewValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        rating: zod_1.z.number().min(1).max(5).optional(),
        description: zod_1.z.string().optional(),
        status: zod_1.z.enum(["pending", "approved", "rejected"]).optional(),
    }),
});
