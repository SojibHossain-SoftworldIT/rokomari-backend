"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = require("mongoose");
// Shipping Schema
const shippingSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Shipping name is required!"],
    },
    type: {
        type: String,
        enum: ["free", "percentage", "amount"],
        required: [true, "Shipping type is required!"],
    },
}, { _id: false });
// Total Amount Schema
const totalAmountSchema = new mongoose_1.Schema({
    subTotal: {
        type: Number,
        required: [true, "SubTotal is required!"],
    },
    tax: {
        type: Number,
        required: [true, "Tax is required!"],
    },
    shipping: {
        type: shippingSchema,
        required: [true, "Shipping info is required!"],
    },
    discount: {
        type: Number,
        required: [true, "Discount is required!"],
    },
    total: {
        type: Number,
        required: [true, "Total is required!"],
    },
}, { _id: false });
// Customer Info Schema
const customerInfoSchema = new mongoose_1.Schema({
    firstName: { type: String, required: [true, "First name is required!"] },
    lastName: { type: String, required: [true, "Last name is required!"] },
    email: { type: String, required: [true, "Email is required!"] },
    phone: { type: String, required: [true, "Phone number is required!"] },
    altPhone: { type: String },
    pickupLocation: {
        type: String,
        required: [true, "Pickup location is required!"],
    },
    city: { type: String, required: [true, "City is required!"] },
    area: { type: String, required: [true, "Area is required!"] },
    zone: { type: String },
    address: { type: String, required: [true, "Address is required!"] },
    postalCode: { type: String, required: [true, "Postal code is required!"] },
    country: { type: String, required: [true, "Country is required!"] },
}, { _id: false });
// Payment Info Schema
const paymentInfoSchema = new mongoose_1.Schema({
    cardNumber: { type: String, required: [true, "Card number is required!"] },
    expireDate: { type: String, required: [true, "Expire date is required!"] },
    cvc: { type: String, required: [true, "CVC is required!"] },
    nameOnCard: { type: String, required: [true, "Name on card is required!"] },
}, { _id: false });
// Order Info Schema
const orderInfoSchema = new mongoose_1.Schema({
    orderBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "customer",
    },
    productInfo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    trackingNumber: {
        type: String,
    },
    status: {
        type: String,
        enum: [
            "pending",
            "processing",
            "at-local-facility",
            "out-for-delivery",
            "cancelled",
            "completed",
        ],
        required: true,
        default: "pending",
    },
    isCancelled: {
        type: Boolean,
        default: false,
    },
    quantity: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: totalAmountSchema,
        required: true,
    },
}, { _id: false });
// Main Order Schema
const orderSchema = new mongoose_1.Schema({
    orderInfo: {
        type: [orderInfoSchema],
        required: true,
    },
    customerInfo: {
        type: customerInfoSchema,
        required: true,
    },
    paymentInfo: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
exports.OrderModel = (0, mongoose_1.model)("order", orderSchema);
