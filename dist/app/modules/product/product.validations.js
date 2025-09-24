"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductZodSchema = exports.createProductZodSchema = exports.bookInfoZodSchema = void 0;
const zod_1 = require("zod");
// categoryAndTags validation
const categoryAndTagsZodSchema = zod_1.z.object({
    publisher: zod_1.z.string({ error: "Publisher ID is required!" }),
    categories: zod_1.z.array(zod_1.z.string()).min(1, "At least one category is required!"),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
// description validation
const descriptionZodSchema = zod_1.z.object({
    name: zod_1.z.string({ error: "Name is required!" }),
    slug: zod_1.z.string().optional(),
    description: zod_1.z.string({ error: "Description is required!" }),
    status: zod_1.z.enum(["publish", "draft"]),
    name_bn: zod_1.z.string().optional(),
    description_bn: zod_1.z.string().optional(),
    metaTitle: zod_1.z.string().optional(),
    metaDescription: zod_1.z.string().optional(),
    keywords: zod_1.z.array(zod_1.z.string()).optional(),
});
// external product validation
const externalZodSchema = zod_1.z.object({
    productUrl: zod_1.z.string().url().optional(),
    buttonLabel: zod_1.z.string().optional(),
});
// productInfo validation
const productInfoZodSchema = zod_1.z.object({
    price: zod_1.z.number({ error: "Price is required!" }),
    salePrice: zod_1.z.number().optional(),
    quantity: zod_1.z.number({ error: "Quantity is required!" }),
    sku: zod_1.z.string({ error: "SKU is required!" }),
    weight: zod_1.z.string().optional(),
    dimensions: zod_1.z
        .object({
        width: zod_1.z.string().optional(),
        height: zod_1.z.string().optional(),
        length: zod_1.z.string().optional(),
    })
        .optional(),
    isDigital: zod_1.z.boolean().optional(),
    digital: zod_1.z.string().optional(),
    isExternal: zod_1.z.boolean().optional(),
    external: externalZodSchema.optional(),
    discount: zod_1.z.number().optional(),
    status: zod_1.z.enum(["draft", "publish", "low-quantity", "out-of-stock"]),
    publicationDate: zod_1.z.string().optional(),
    isOnSale: zod_1.z.boolean().optional(),
    campaign: zod_1.z.string().optional(),
});
// author validation
const authorZodSchema = zod_1.z.object({
    name: zod_1.z.string({ error: "Author name is required!" }),
    image: zod_1.z.string().url().optional(),
    description: zod_1.z.string().optional(),
});
// specification validation
const specificationZodSchema = zod_1.z.object({
    authors: zod_1.z.array(authorZodSchema).min(1, "At least one author is required!"),
    publisher: zod_1.z.string({ error: "Publisher is required!" }),
    edition: zod_1.z.string().optional(),
    editionYear: zod_1.z.number().optional(),
    numberOfPages: zod_1.z.number({ error: "Number of pages is required!" }),
    country: zod_1.z.string({ error: "Country is required!" }),
    language: zod_1.z.string({ error: "Language is required!" }),
    isbn: zod_1.z.string().optional(),
    binding: zod_1.z.enum(["hardcover", "paperback"]).optional(),
});
// bookInfo validation
exports.bookInfoZodSchema = zod_1.z.object({
    specification: specificationZodSchema,
    format: zod_1.z.enum(["hardcover", "paperback", "ebook", "audiobook"]).optional(),
    genre: zod_1.z.array(zod_1.z.string()).optional(),
    series: zod_1.z.string().optional(),
    translator: zod_1.z.string().optional(),
});
// Create product
exports.createProductZodSchema = zod_1.z.object({
    featuredImg: zod_1.z.string().optional(),
    gallery: zod_1.z.array(zod_1.z.string()).optional(),
    video: zod_1.z.string().optional(),
    categoryAndTags: categoryAndTagsZodSchema,
    description: descriptionZodSchema,
    productType: zod_1.z.enum(["simple", "variable"]),
    productInfo: productInfoZodSchema,
    bookInfo: exports.bookInfoZodSchema,
});
// Update product
exports.updateProductZodSchema = exports.createProductZodSchema.partial().extend({
    deletedImages: zod_1.z.array(zod_1.z.string()).optional(),
});
