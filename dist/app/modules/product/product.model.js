"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
// Helper function for discount calculation
const calculateDiscount = (price, salePrice) => {
    if (!salePrice || salePrice <= 0)
        return 0;
    return Math.round(((price - salePrice) / price) * 100);
};
// Category & Tags Schema
// const categoryAndTagsSchema = new Schema<TCategoryAndTags>(
//   {
//     publisher: { type: String, required: true },
//     categories: [{ type: String, required: true }],
//     tags: [{ type: String }],
//   },
//   { _id: false }
// );
// Category & Tags Schema
const categoryAndTagsSchema = new mongoose_1.Schema({
    publisher: {
        type: String,
    },
    categories: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "category", required: true },
    ],
    tags: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "tag", required: true }],
    subCategories: [String],
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
    productTitle: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: mongoose_1.Schema.Types.ObjectId, ref: "brand" },
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
    totalDiscount: { type: Number, default: 0 },
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
// const authorSchema = new Schema<TAuthor>(
//   {
//     name: { type: String, required: true },
//     image: String,
//     description: String,
//   },
//   { _id: false }
// );
// Specification Schema
const specificationSchema = new mongoose_1.Schema({
    authors: { type: [mongoose_1.Schema.Types.ObjectId], ref: "Author", required: true },
    publisher: {
        type: String,
        required: false,
    },
    edition: String,
    editionYear: Number,
    // numberOfPages: { type: Number, required: true },
    numberOfPages: { type: Number, required: false },
    country: { type: String, required: true },
    language: { type: String, required: true },
    isbn: String,
    binding: { type: String, enum: ["hardcover", "paperback"] },
}, { _id: false });
// BookInfo Schema
const bookInfoSchema = new mongoose_1.Schema({
    specification: { type: specificationSchema, required: false },
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
    previewImg: [String],
    gallery: [String],
    video: String,
    categoryAndTags: { type: categoryAndTagsSchema, required: true },
    description: { type: descriptionSchema, required: true },
    productType: { type: String, enum: ["simple", "variable"], required: true },
    productInfo: { type: productInfoSchema, required: true },
    bookInfo: { type: bookInfoSchema },
    averageRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    wishlistCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
}, { timestamps: true });
// 🔹 Pre-save middleware
productSchema.pre("save", function (next) {
    var _a, _b;
    if (this.productInfo) {
        this.productInfo.totalDiscount = calculateDiscount(this.productInfo.price, this.productInfo.salePrice);
    }
    if ((_b = (_a = this.bookInfo) === null || _a === void 0 ? void 0 : _a.specification) === null || _b === void 0 ? void 0 : _b.binding) {
        this.bookInfo.specification.binding =
            this.bookInfo.specification.binding.toLowerCase();
    }
    next();
});
// 🔹 Pre-findOneAndUpdate middleware
productSchema.pre("findOneAndUpdate", function (next) {
    var _a, _b, _c, _d;
    const update = this.getUpdate();
    if (((_a = update === null || update === void 0 ? void 0 : update.productInfo) === null || _a === void 0 ? void 0 : _a.price) !== undefined) {
        const price = update.productInfo.price;
        const salePrice = (_b = update.productInfo.salePrice) !== null && _b !== void 0 ? _b : 0;
        update.productInfo.totalDiscount = calculateDiscount(price, salePrice);
    }
    if ((_d = (_c = update === null || update === void 0 ? void 0 : update.bookInfo) === null || _c === void 0 ? void 0 : _c.specification) === null || _d === void 0 ? void 0 : _d.binding) {
        update.bookInfo.specification.binding =
            update.bookInfo.specification.binding.toLowerCase();
    }
    this.setUpdate(update);
    next();
});
exports.ProductModel = (0, mongoose_1.model)("Product", productSchema);
