import { z } from "zod";

// Summery validation
const summeryZodSchema = z.object({
  totalRevenue: z.number({
    error: () => "Total revenue is required!",
  }),
  todaysRevenue: z.number({
    error: () => "Today's revenue is required!",
  }),
  todaysRefund: z.number({
    error: () => "Today's refund is required!",
  }),
  totalShop: z.number({
    error: () => "Total shop count is required!",
  }),
});

// Order Status validation
const orderStatusZodSchema = z.object({
  pending: z.number().default(0),
  processing: z.number().default(0),
  completed: z.number().default(0),
  cancelled: z.number().default(0),
});

// Sales History validation
const salesHistoryZodSchema = z.object({
  totalSales: z.number({
    error: () => "Total sales is required!",
  }),
  months: z.enum(
    [
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
    ],
    {
      message: "Month is required!",
    }
  ),
});

// Top Category validation
const topCategoryZodSchema = z.object({
  categoryId: z.string({
    error: () => "CategoryId is required!",
  }),
  categoryName: z.string({
    error: () => "Category name is required!",
  }),
  shop: z.string({
    error: () => "Shop name is required!",
  }),
  totalProducts: z.number({
    error: () => "Total products count is required!",
  }),
});

// Main Vendor Validation
export const createVendorZodSchema = z.object({
  userId: z.string({
    error: () => "UserId is required!",
  }),
  shops: z.string({
    error: () => "Shop reference is required!",
  }),
  shopTransfer: z.array(z.string()).optional(),
  messages: z.array(z.string()).optional(),
  storeNotices: z.array(z.string()).optional(),
  summery: summeryZodSchema,
  orderStatus: orderStatusZodSchema,
  salesHistory: salesHistoryZodSchema,
  topCategoryByProducts: z.array(topCategoryZodSchema).optional(),
  status: z.enum(["pending", "approved"], {
    message: "Status must be either 'pending' or 'approved'",
  }),
});
