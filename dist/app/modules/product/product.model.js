"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
const brandAndCategorySchema = new mongoose_1.Schema({
    brand: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Brand is Required!"],
        ref: "brand",
    },
    categories: {
        type: [mongoose_1.Schema.Types.ObjectId],
        required: [true, "Category is Required!"],
        ref: "category",
    },
    tags: {
        type: [mongoose_1.Schema.Types.ObjectId],
        required: [true, "Tag is Required!"],
        ref: "tag",
    },
}, { _id: false } // Prevents creating a separate _id for icon
);
const descriptionSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is Required!"],
    },
    slug: { type: String },
    unit: {
        type: String,
        required: [true, "Unit is Required!"],
    },
    description: {
        type: String,
        required: [true, "A small description is required!"],
    },
    status: {
        type: String,
        enum: ["publish", "draft"],
        required: [true, "Status is required!"],
        default: "draft",
    },
}, { _id: false } // Prevents creating a separate _id for icon
);
const externalSchema = new mongoose_1.Schema({
    productUrl: {
        type: String,
    },
    buttonLabel: {
        type: String,
    },
}, { _id: false } // Prevents creating a separate _id for icon
);
const productInfoSchema = new mongoose_1.Schema({
    price: {
        type: Number,
        required: [true, "Price is Required!"],
    },
    salePrice: {
        type: Number,
        required: [true, "Sale price is Required!"],
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is Required!"],
    },
    sku: {
        type: String,
        required: [true, "sku is Required!"],
    },
    width: {
        type: String,
        required: [true, "Width is Required!"],
    },
    height: {
        type: String,
        required: [true, "Height is Required!"],
    },
    length: {
        type: String,
        required: [true, "Length is Required!"],
    },
    isDigital: {
        type: Boolean,
    },
    digital: {
        type: String,
    },
    isExternal: {
        type: Boolean,
    },
    external: externalSchema,
    status: {
        type: String,
        enum: ["draft", "publish", "low-quantity"],
        required: [true, "Status is Required!"],
    },
}, {
    timestamps: true,
});
const productSchema = new mongoose_1.Schema({
    shopId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "ShopId is Required!"],
    },
    featuredImg: {
        type: String,
        required: [true, "Feature image is Required!"],
    },
    gallery: {
        type: [String],
        required: [true, "Gallery is Required!"],
        default: [],
    },
    video: {
        type: String,
    },
    brandAndCategories: brandAndCategorySchema,
    description: descriptionSchema,
    productType: {
        type: String,
        enum: ["simple", "variable"],
        required: [true, "Product type is Required!"],
    },
    productInfo: productInfoSchema,
}, {
    timestamps: true,
});
exports.ProductModel = (0, mongoose_1.model)("product", productSchema);
