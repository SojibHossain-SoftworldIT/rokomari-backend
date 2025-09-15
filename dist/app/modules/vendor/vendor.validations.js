"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVendorZodSchema = void 0;
const zod_1 = require("zod");
// Summery validation
const summeryZodSchema = zod_1.z.object({
    totalRevenue: zod_1.z.number({
        error: () => "Total revenue is required!",
    }),
    todaysRevenue: zod_1.z.number({
        error: () => "Today's revenue is required!",
    }),
    todaysRefund: zod_1.z.number({
        error: () => "Today's refund is required!",
    }),
    totalShop: zod_1.z.number({
        error: () => "Total shop count is required!",
    }),
});
// Order Status validation
const orderStatusZodSchema = zod_1.z.object({
    pending: zod_1.z.number().default(0),
    processing: zod_1.z.number().default(0),
    completed: zod_1.z.number().default(0),
    cancelled: zod_1.z.number().default(0),
});
// Sales History validation
const salesHistoryZodSchema = zod_1.z.object({
    totalSales: zod_1.z.number({
        error: () => "Total sales is required!",
    }),
    months: zod_1.z.enum([
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ], {
        message: "Month is required!",
    }),
});
// Top Category validation
const topCategoryZodSchema = zod_1.z.object({
    categoryId: zod_1.z.string({
        error: () => "CategoryId is required!",
    }),
    categoryName: zod_1.z.string({
        error: () => "Category name is required!",
    }),
    shop: zod_1.z.string({
        error: () => "Shop name is required!",
    }),
    totalProducts: zod_1.z.number({
        error: () => "Total products count is required!",
    }),
});
// Main Vendor Validation
exports.createVendorZodSchema = zod_1.z.object({
    userId: zod_1.z.string({
        error: () => "UserId is required!",
    }),
    shops: zod_1.z.string({
        error: () => "Shop reference is required!",
    }),
    shopTransfer: zod_1.z.array(zod_1.z.string()).optional(),
    messages: zod_1.z.array(zod_1.z.string()).optional(),
    storeNotices: zod_1.z.array(zod_1.z.string()).optional(),
    summery: summeryZodSchema,
    orderStatus: orderStatusZodSchema,
    salesHistory: salesHistoryZodSchema,
    topCategoryByProducts: zod_1.z.array(topCategoryZodSchema).optional(),
    status: zod_1.z.enum(["pending", "approved"], {
        message: "Status must be either 'pending' or 'approved'",
    }),
});
