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
const category_model_1 = require("../category/category.model");
const product_const_1 = require("./product.const");
const product_model_1 = require("./product.model");
//normalize binding input
const normalizeBinding = (binding) => {
    if (!binding)
        return binding;
    return binding.toLowerCase();
};
// const createProductOnDB = async (payload: TProduct) => {
//   const result = await ProductModel.create(payload);
//   return result;
// };
// 🔹 Create product
// const createProductOnDB = async (payload: TProduct) => {
//   // Ensure salePrice is defined if isOnSale is true
//   if (payload.bookInfo?.specification?.binding) {
//     payload.bookInfo.specification.binding = normalizeBinding(
//       payload.bookInfo.specification.binding
//     ) as "hardcover" | "paperback";
//   }
//   const result = await ProductModel.create(payload);
//   return result;
// };
const createProductOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    // 🔹 Fetch category to check if it's a Book-type product
    // Use a type assertion because 'category' is not declared on TProduct in the current interface.
    const categoryId = payload.category;
    const category = yield category_model_1.CategoryModel.findById(categoryId).populate("mainCategory");
    const isBook = 
    // category?.name?.toLowerCase() === "book" ||
    ((_a = category === null || category === void 0 ? void 0 : category.mainCategory) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "book";
    // 🔹 Conditionally process bookInfo
    if (isBook) {
        if ((_c = (_b = payload.bookInfo) === null || _b === void 0 ? void 0 : _b.specification) === null || _c === void 0 ? void 0 : _c.binding) {
            payload.bookInfo.specification.binding = normalizeBinding(payload.bookInfo.specification.binding);
        }
    }
    else {
        // 🧹 Remove bookInfo if category is not a book
        delete payload.bookInfo;
    }
    const result = yield product_model_1.ProductModel.create(payload);
    return result;
});
const getAllProductFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const productQuery = new QueryBuilder_1.default(product_model_1.ProductModel.find()
        .populate("categoryAndTags.publisher")
        .populate("categoryAndTags.categories")
        .populate("categoryAndTags.tags")
        .populate("bookInfo.specification.authors"), query)
        .search(product_const_1.ProductSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    // ✅ Execute main query for product data
    const data = yield productQuery.modelQuery;
    // ✅ Use built-in countTotal() from QueryBuilder
    const meta = yield productQuery.countTotal();
    return {
        meta,
        data,
    };
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
            $lookup: {
                from: "authors",
                localField: "bookInfo.specification.authors",
                foreignField: "_id",
                as: "authorsDetails",
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
        .populate("categoryAndTags.tags")
        .populate("bookInfo.specification.authors");
});
const updateProductOnDB = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const isProductExist = yield product_model_1.ProductModel.findById(id);
    if (!isProductExist) {
        throw new handleAppError_1.default(404, "Product not found!");
    }
    // Normalize binding
    if ((_b = (_a = updatedData.bookInfo) === null || _a === void 0 ? void 0 : _a.specification) === null || _b === void 0 ? void 0 : _b.binding) {
        updatedData.bookInfo.specification.binding = normalizeBinding(updatedData.bookInfo.specification.binding);
    }
    // 🧩 Handle author image cleanup
    // const oldAuthors = isProductExist.bookInfo?.specification?.authors || [];
    // const newAuthors = updatedData.bookInfo?.specification?.authors || [];
    // const deletedImages = oldAuthors
    //   .filter((old) => !newAuthors.some((n) => n.image === old.image))
    //   .map((a) => a.image)
    //   .filter(Boolean);
    // // 🧩 Handle gallery cleanup
    // if ((updatedData as any).deletedImages?.length > 0) {
    //   await Promise.all(
    //     (updatedData as any).deletedImages.map((img: string) =>
    //       deleteImageFromCLoudinary(img)
    //     )
    //   );
    // }
    // // 🧩 Handle gallery cleanup
    // if ((updatedData as any).deletedImages?.length > 0) {
    //   await Promise.all(
    //     (updatedData as any).deletedImages.map((img: string) =>
    //       deleteImageFromCLoudinary(img)
    //     )
    //   );
    // }
    // 🧩 Handle gallery cleanup
    if (((_c = updatedData.deletedImages) === null || _c === void 0 ? void 0 : _c.length) > 0) {
        yield Promise.all(updatedData.deletedImages.map((img) => (0, cloudinary_config_1.deleteImageFromCLoudinary)(img)));
    }
    // handle gallery update with deletedImages
    if (updatedData.deletedImages &&
        updatedData.deletedImages.length > 0 &&
        ((_d = isProductExist.gallery) === null || _d === void 0 ? void 0 : _d.length)) {
        const restDBImages = isProductExist.gallery.filter((img) => { var _a; return !((_a = updatedData.deletedImages) === null || _a === void 0 ? void 0 : _a.includes(img)); });
        const updatedGalleryImages = (updatedData.gallery || [])
            .filter((img) => { var _a; return !((_a = updatedData.deletedImages) === null || _a === void 0 ? void 0 : _a.includes(img)); })
            .filter((img) => !restDBImages.includes(img));
        updatedData.gallery = [...restDBImages, ...updatedGalleryImages];
    }
    const updatedProduct = yield product_model_1.ProductModel.findByIdAndUpdate(id, { $set: updatedData }, { new: true, runValidators: true });
    // delete images from cloudinary
    if (((_e = updatedData.deletedImages) === null || _e === void 0 ? void 0 : _e.length) > 0) {
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
const getProductsByAuthorFromDB = (authorId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const productQuery = new QueryBuilder_1.default(product_model_1.ProductModel.find({
        "bookInfo.specification.authors": authorId,
    })
        .populate("categoryAndTags.categories")
        .populate("categoryAndTags.tags")
        .populate("bookInfo.specification.authors"), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const data = yield productQuery.modelQuery;
    const meta = yield productQuery.countTotal();
    return { meta, data };
});
exports.productServices = {
    createProductOnDB,
    getAllProductFromDB,
    deleteSingleProductOnDB,
    searchProductsFromDB,
    getProductsByCategoryandTag,
    getSingleProductFromDB,
    updateProductOnDB,
    getProductsByAuthorFromDB,
};
