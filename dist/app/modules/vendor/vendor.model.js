"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorModel = void 0;
const mongoose_1 = require("mongoose");
// Summery Schema
const summerySchema = new mongoose_1.Schema({
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
}, { _id: false });
// Order Status Schema
const orderStatusSchema = new mongoose_1.Schema({
    pending: { type: Number, required: true, default: 0 },
    processing: { type: Number, required: true, default: 0 },
    completed: { type: Number, required: true, default: 0 },
    cancelled: { type: Number, required: true, default: 0 },
}, { _id: false });
// Sales History Schema
const salesHistorySchema = new mongoose_1.Schema({
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
}, { _id: false });
// Top Category By Products Schema
const categoryByProductSchema = new mongoose_1.Schema({
    categoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { _id: false });
// Main Vendor Schema
const vendorSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "UserId is required!"],
    },
    shops: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "shop",
        required: [true, "Shop reference is required!"],
    },
    shopTransfer: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "transfer",
        },
    ],
    messages: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "message",
        },
    ],
    storeNotices: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true });
exports.VendorModel = (0, mongoose_1.model)("vendor", vendorSchema);
