"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const cloudinary_config_1 = require("../../config/cloudinary.config");
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const product_const_1 = require("./product.const");
const product_model_1 = require("./product.model");
const createProductOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.ProductModel.create(payload);
    return result;
});
const getAllProductFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const productQuery = new QueryBuilder_1.default(product_model_1.ProductModel.find()
        .populate("categoryAndTags.publisher")
        .populate("categoryAndTags.categories")
        .populate("categoryAndTags.tags"), query)
        .search(product_const_1.ProductSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    return yield productQuery.modelQuery;
});
const getProductsByCategoryandTag = (category, tag) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = category ? category.split(",") : [];
    const tags = tag ? tag.split(",") : [];
    return product_model_1.ProductModel.aggregate([
        {
            $lookup: {
                from: "categories",
                localField: "categoryAndTags.categories",
                foreignField: "_id",
                as: "categoryDetails",
            },
        },
        {
            $lookup: {
                from: "tags",
                localField: "categoryAndTags.tags",
                foreignField: "_id",
                as: "tagDetails",
            },
        },
        {
            $lookup: {
                from: "publishers",
                localField: "categoryAndTags.publisher",
                foreignField: "_id",
                as: "publisherDetails",
            },
        },
        {
            $addFields: {
                categoryAndTags: {
                    publisher: { $arrayElemAt: ["$publisherDetails", 0] },
                    categories: "$categoryDetails",
                    tags: "$tagDetails",
                },
            },
        },
        {
            $match: Object.assign(Object.assign({ "description.status": "publish" }, (categories.length
                ? { "categoryAndTags.categories.name": { $in: categories } }
                : {})), (tags.length ? { "categoryAndTags.tags.name": { $in: tags } } : {})),
        },
        {
            $project: {
                categoryDetails: 0,
                tagDetails: 0,
                publisherDetails: 0,
            },
        },
    ]);
});
const getSingleProductFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return product_model_1.ProductModel.findById(id)
        .populate("categoryAndTags.publisher")
        .populate("categoryAndTags.categories")
        .populate("categoryAndTags.tags");
});
const updateProductOnDB = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const isProductExist = yield product_model_1.ProductModel.findById(id);
    if (!isProductExist) {
        throw new handleAppError_1.default(404, "Product not found!");
    }
    // handle gallery update with deletedImages
    if (updatedData.deletedImages &&
        updatedData.deletedImages.length > 0 &&
        ((_a = isProductExist.gallery) === null || _a === void 0 ? void 0 : _a.length)) {
        const restDBImages = isProductExist.gallery.filter((img) => { var _a; return !((_a = updatedData.deletedImages) === null || _a === void 0 ? void 0 : _a.includes(img)); });
        const updatedGalleryImages = (updatedData.gallery || [])
            .filter((img) => { var _a; return !((_a = updatedData.deletedImages) === null || _a === void 0 ? void 0 : _a.includes(img)); })
            .filter((img) => !restDBImages.includes(img));
        updatedData.gallery = [...restDBImages, ...updatedGalleryImages];
    }
    const updatedProduct = yield product_model_1.ProductModel.findByIdAndUpdate(id, { $set: updatedData }, { new: true, runValidators: true });
    // delete images from cloudinary
    if (((_b = updatedData.deletedImages) === null || _b === void 0 ? void 0 : _b.length) > 0) {
        yield Promise.all(updatedData.deletedImages.map((img) => (0, cloudinary_config_1.deleteImageFromCLoudinary)(img)));
    }
    if (updatedData.featuredImg && isProductExist.featuredImg) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(isProductExist.featuredImg);
    }
    return updatedProduct;
});
// delete product from database
const deleteSingleProductOnDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.ProductModel.findByIdAndDelete(id);
    if (!product) {
        throw new handleAppError_1.default(404, "Product not found!");
    }
});
// search products
const searchProductsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    if (!query)
        return [];
    // Exact match query
    const exactMatch = yield product_model_1.ProductModel.find({
        $or: [
            { "description.name": query },
            { "description.slug": query },
            { "productInfo.sku": query },
            { "bookInfo.specification.isbn": query },
        ],
    })
        .limit(10)
        .populate("categoryAndTags.categories")
        .populate("categoryAndTags.tags")
        .populate("categoryAndTags.publisher");
    if (exactMatch.length > 0)
        return exactMatch;
    // Partial match (case-insensitive)
    const partialMatch = yield product_model_1.ProductModel.find({
        $or: [
            { "description.name": { $regex: query, $options: "i" } },
            { "description.slug": { $regex: query, $options: "i" } },
            { "description.description": { $regex: query, $options: "i" } },
            {
                "bookInfo.specification.authors.name": { $regex: query, $options: "i" },
            },
            { "bookInfo.specification.publisher": { $regex: query, $options: "i" } },
            { "bookInfo.specification.language": { $regex: query, $options: "i" } },
            { "bookInfo.genre": { $regex: query, $options: "i" } },
        ],
    })
        .limit(10)
        .populate("categoryAndTags.categories")
        .populate("categoryAndTags.tags")
        .populate("categoryAndTags.publisher");
    return partialMatch;
});
exports.productServices = {
    createProductOnDB,
    getAllProductFromDB,
    deleteSingleProductOnDB,
    searchProductsFromDB,
    getProductsByCategoryandTag,
    getSingleProductFromDB,
    updateProductOnDB,
};
