import { model, Schema } from "mongoose";
import {
  TVendor,
  TOrderStatus,
  TSalesHistory,
  TCategoryByProduct,
  TSummery,
} from "./vendor.interface";

// Summery Schema
const summerySchema = new Schema<TSummery>(
  {
    totalRevenue: {
      type: Number,
      required: [true, "Total revenue is required!"],
    },
    todaysRevenue: {
      type: Number,
      required: [true, "Today's revenue is required!"],
    },
    todaysRefund: {
      type: Number,
      required: [true, "Today's refund is required!"],
    },
    totalShop: {
      type: Number,
      required: [true, "Total shop count is required!"],
    },
  },
  { _id: false }
);

// Order Status Schema
const orderStatusSchema = new Schema<TOrderStatus>(
  {
    pending: { type: Number, required: true, default: 0 },
    processing: { type: Number, required: true, default: 0 },
    completed: { type: Number, required: true, default: 0 },
    cancelled: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

// Sales History Schema
const salesHistorySchema = new Schema<TSalesHistory>(
  {
    totalSales: { type: Number, required: [true, "Total sales is required!"] },
    months: {
      type: String,
      enum: [
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
      required: [true, "Month is required!"],
    },
  },
  { _id: false }
);

// Top Category By Products Schema
const categoryByProductSchema = new Schema<TCategoryByProduct>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: [true, "CategoryId is required!"],
    },
    categoryName: {
      type: String,
      required: [true, "Category name is required!"],
    },
    shop: {
      type: String,
      required: [true, "Shop name is required!"],
    },
    totalProducts: {
      type: Number,
      required: [true, "Total products count is required!"],
    },
  },
  { _id: false }
);

// Main Vendor Schema
const vendorSchema = new Schema<TVendor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "UserId is required!"],
    },
    shops: {
      type: Schema.Types.ObjectId,
      ref: "shop",
      required: [true, "Shop reference is required!"],
    },
    shopTransfer: [
      {
        type: Schema.Types.ObjectId,
        ref: "transfer",
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "message",
      },
    ],
    storeNotices: [
      {
        type: Schema.Types.ObjectId,
        ref: "notice",
      },
    ],
    summery: {
      type: summerySchema,
      required: true,
    },
    orderStatus: {
      type: orderStatusSchema,
      required: true,
    },
    salesHistory: {
      type: salesHistorySchema,
      required: true,
    },
    topCategoryByProducts: {
      type: [categoryByProductSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["pending", "approved"],
      required: true,
      default: "pending",
    },
  },
  { timestamps: true }
);

export const VendorModel = model<TVendor>("vendor", vendorSchema);
