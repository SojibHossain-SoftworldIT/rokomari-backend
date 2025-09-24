"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
// Category & Tags Schema
const categoryAndTagsSchema = new mongoose_1.Schema({
    publisher: { type: String, required: true },
    categories: [{ type: String, required: true }],
    tags: [{ type: String }],
}, { _id: false });
// Description Schema
const descriptionSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["publish", "draft"], default: "draft" },
    name_bn: String,
    description_bn: String,
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
}, { _id: false });
// External Schema
const externalSchema = new mongoose_1.Schema({
    productUrl: String,
    buttonLabel: String,
}, { _id: false });
// Product Info Schema
const productInfoSchema = new mongoose_1.Schema({
    price: { type: Number, required: true },
    salePrice: Number,
    quantity: { type: Number, required: true },
    sku: { type: String, required: true, unique: true },
    weight: String,
    dimensions: {
        width: String,
        height: String,
        length: String,
    },
    isDigital: Boolean,
    digital: String,
    isExternal: Boolean,
    external: externalSchema,
    discount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ["draft", "publish", "low-quantity", "out-of-stock"],
        default: "publish",
    },
    publicationDate: Date,
    isOnSale: { type: Boolean, default: false },
    campaign: String,
    inStock: { type: Boolean, default: true },
}, { _id: false });
// Author Schema
const authorSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    image: String,
    description: String,
}, { _id: false });
// Specification Schema
const specificationSchema = new mongoose_1.Schema({
    authors: { type: [authorSchema], required: true },
    publisher: {
        type: String,
        required: true,
    },
    edition: String,
    editionYear: Number,
    numberOfPages: { type: Number, required: true },
    country: { type: String, required: true },
    language: { type: String, required: true },
    isbn: String,
    binding: { type: String, enum: ["hardcover", "paperback"] },
}, { _id: false });
// BookInfo Schema
const bookInfoSchema = new mongoose_1.Schema({
    specification: { type: specificationSchema, required: true },
    format: {
        type: String,
        enum: ["hardcover", "paperback", "ebook", "audiobook"],
    },
    genre: [String],
    series: String,
    translator: String,
}, { _id: false });
// Product Schema
const productSchema = new mongoose_1.Schema({
    featuredImg: { type: String, required: true },
    gallery: [String],
    video: String,
    categoryAndTags: { type: categoryAndTagsSchema, required: true },
    description: { type: descriptionSchema, required: true },
    productType: { type: String, enum: ["simple", "variable"], required: true },
    productInfo: { type: productInfoSchema, required: true },
    bookInfo: { type: bookInfoSchema, required: true },
    averageRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    wishlistCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
}, { timestamps: true });
exports.ProductModel = (0, mongoose_1.model)("Product", productSchema);
