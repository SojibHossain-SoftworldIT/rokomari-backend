import { z } from "zod";

// ObjectId validation
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Must be a valid ObjectId string");

// Shipping Validation
const shippingZodSchema = z.object({
  name: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Shipping name is required!"
        : "Must be a string!",
  }),
  type: z.enum(["free", "percentage", "amount"], {
    message: "Shipping type must be either 'free', 'percentage', or 'amount'",
  }),
});

// Total Amount Validation
const totalAmountZodSchema = z.object({
  subTotal: z.number({
    error: (issue) =>
      issue.input === undefined ? "SubTotal is required!" : "Must be a number!",
  }),
  tax: z.number({
    error: (issue) =>
      issue.input === undefined ? "Tax is required!" : "Must be a number!",
  }),
  shipping: shippingZodSchema,
  discount: z.number({
    error: (issue) =>
      issue.input === undefined ? "Discount is required!" : "Must be a number!",
  }),
  total: z.number({
    error: (issue) =>
      issue.input === undefined ? "Total is required!" : "Must be a number!",
  }),
});

// Customer Info Validation
const customerInfoZodSchema = z.object({
  firstName: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "First name is required!"
        : "Must be a string!",
  }),
  lastName: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Last name is required!"
        : "Must be a string!",
  }),
  email: z.string().email("Must be a valid email!"),
  phone: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Phone number is required!"
        : "Must be a string!",
  }),
  alphone: z.string().optional(),
  pickupLocation: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Pickup location is required!"
        : "Must be a string!",
  }),
  area: z.string({
    error: (issue) =>
      issue.input === undefined ? "Area is required!" : "Must be a string!",
  }),
  zone: z.string({
    error: (issue) =>
      issue.input === undefined ? "Zone is required!" : "Must be a string!",
  }),

  address: z.string({
    error: (issue) =>
      issue.input === undefined ? "Address is required!" : "Must be a string!",
  }),
  city: z.string({
    error: (issue) =>
      issue.input === undefined ? "City is required!" : "Must be a string!",
  }),
  postalCode: z.string().optional(),
  country: z.string({
    error: (issue) =>
      issue.input === undefined ? "Country is required!" : "Must be a string!",
  }),
});

// Payment Info Validation
const paymentInfoZodSchema = z.union([
  z.literal("cash-on"),
  z.object({
    cardNumber: z.string({
      error: (issue) =>
        issue.input === undefined
          ? "Card number is required!"
          : "Must be a string!",
    }),
    expireDate: z.string({
      error: (issue) =>
        issue.input === undefined
          ? "Expire date is required!"
          : "Must be a string!",
    }),
    cvc: z.string({
      error: (issue) =>
        issue.input === undefined ? "CVC is required!" : "Must be a string!",
    }),
    nameOnCard: z.string({
      error: (issue) =>
        issue.input === undefined
          ? "Name on card is required!"
          : "Must be a string!",
    }),
  }),
]);

// Order Info Validation
const orderInfoZodSchema = z.object({
  orderBy: objectIdSchema.or(z.string().optional()),
  productInfo: objectIdSchema.or(
    z.string({
      error: (issue) =>
        issue.input === undefined
          ? "Product info is required!"
          : "Must be a valid ObjectId string!",
    })
  ),
  trackingNumber: z.string().optional(),
  status: z
    .enum(
      [
        "pending",
        "processing",
        "at-local-facility",
        "out-for-delivery",
        "cancelled",
        "completed",
      ],
      {
        message:
          "Status must be one of 'pending', 'processing', 'at-local-facility', 'out-for-delivery', 'cancelled', or 'completed'",
      }
    )
    .optional()
    .default("pending"),
  isCancelled: z.boolean().optional().default(false),
  quantity: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Quantity is required!"
          : "Must be a number!",
    })
    .min(1, "Quantity must be at least 1"),
  totalAmount: totalAmountZodSchema,
});

// Main Order Validation
export const createOrderZodSchema = z.object({
  orderInfo: z
    .array(orderInfoZodSchema)
    .min(1, "At least one order info is required!"),

  customerInfo: customerInfoZodSchema,

  paymentInfo: paymentInfoZodSchema,

  totalAmount: z.number({
    error: (issue) =>
      issue.input === undefined
        ? "Total amount is required!"
        : "Must be a number!",
  }),
});

export const changeOrderStatusZodSchema = z.object({
  status: z.enum(
    [
      "pending",
      "processing",
      "at-local-facility",
      "out-for-delivery",
      "cancelled",
      "completed",
    ],
    { message: "Invalid order status!" }
  ),
});
