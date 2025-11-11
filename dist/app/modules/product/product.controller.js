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
exports.productControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const product_service_1 = require("./product.service");
const getAllProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.productServices.getAllProductFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Products retrieve successfully!",
        data: result.data,
        meta: result.meta,
    });
}));
const getProductsByCategoryandTag = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, tag } = req.query;
    const result = yield product_service_1.productServices.getProductsByCategoryandTag(category, tag);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Products retrieve successfully!",
        data: result,
    });
}));
const getSingleProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield product_service_1.productServices.getSingleProductFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Product retrieve successfully!",
        data: result,
    });
}));
// const createProduct = catchAsync(async (req, res) => {
//   const files = req.files as {
//     [fieldname: string]: Express.Multer.File[];
//   };
//   const productData = {
//     ...req.body,
//     featuredImg: files["featuredImgFile"]?.[0]?.path || "",
//     gallery: files["galleryImagesFiles"]
//       ? files["galleryImagesFiles"].map((f) => f.path)
//       : [],
//   };
//   const result = await productServices.createProductOnDB(productData);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.CREATED,
//     message: "Product created successfully!",
//     data: result,
//   });
// });
const createProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const files = req.files || {};
    const productData = Object.assign(Object.assign({}, req.body), { featuredImg: ((_b = (_a = files["featuredImgFile"]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path) || req.body.featuredImg || "", gallery: files["galleryImagesFiles"]
            ? files["galleryImagesFiles"].map((f) => f.path)
            : req.body.gallery || [], previewImg: files["previewImgFile"]
            ? files["previewImgFile"].map((f) => f.path)
            : req.body.previewImg || [] });
    // ✅ Handle author images dynamically
    // if (req.body.bookInfo?.specification?.authors) {
    //   productData.bookInfo.specification.authors =
    //     req.body.bookInfo?.specification?.authors.map(
    //       (author: any, index: number) => ({
    //         ...author,
    //         image: files[`authorImage_${index}`]?.[0]?.path || author.image || "",
    //       })
    //     );
    // }
    const result = yield product_service_1.productServices.createProductOnDB(productData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Product created successfully!",
        data: result,
    });
}));
// const updateProduct = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const files = req.files as {
//     [fieldname: string]: Express.Multer.File[];
//   };
//   const updatedData: any = {
//     ...req.body,
//   };
//   if (files["featuredImgFile"]?.[0]?.path) {
//     updatedData.featuredImg = files["featuredImgFile"][0].path;
//   }
//   if (files["galleryImagesFiles"]?.length) {
//     updatedData.gallery = files["galleryImagesFiles"].map((f) => f.path);
//   }
//   if (files["previewImgFile"]?.length) {
//     updatedData.previewImg = files["previewImgFile"].map((f) => f.path);
//   }
//   const result = await productServices.updateProductOnDB(id, updatedData);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Product updated successfully!",
//     data: result,
//   });
// });
// Product delete controller
const updateProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { id } = req.params;
    const files = req.files || {};
    const updatedData = Object.assign({}, req.body);
    // ✅ Safely handle featured image
    if ((_b = (_a = files["featuredImgFile"]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path) {
        updatedData.featuredImg = files["featuredImgFile"][0].path;
    }
    else if (req.body.featuredImg) {
        updatedData.featuredImg = req.body.featuredImg;
    }
    // ✅ Safely handle gallery
    // if (files["galleryImagesFiles"]?.length) {
    //   updatedData.gallery = files["galleryImagesFiles"].map((f) => f.path);
    // } else if (req.body.gallery) {
    //   // Handle JSON array (stringified or real array)
    //   try {
    //     updatedData.gallery = Array.isArray(req.body.gallery)
    //       ? req.body.gallery
    //       : JSON.parse(req.body.gallery);
    //   } catch {
    //     updatedData.gallery = [req.body.gallery];
    //   }
    // }
    // // ✅ Safely handle preview images
    // if (files["previewImgFile"]?.length) {
    //   updatedData.previewImg = files["previewImgFile"].map((f) => f.path);
    // } else if (req.body.previewImg) {
    //   try {
    //     updatedData.previewImg = Array.isArray(req.body.previewImg)
    //       ? req.body.previewImg
    //       : JSON.parse(req.body.previewImg);
    //   } catch {
    //     updatedData.previewImg = [req.body.previewImg];
    //   }
    // }
    // // ✅ Handle author images update
    // if (updatedData.bookInfo?.specification?.authors) {
    //   updatedData.bookInfo.specification.authors =
    //     updatedData.bookInfo.specification.authors.map(
    //       (author: any, index: number) => ({
    //         ...author,
    //         image: files[`authorImage_${index}`]?.[0]?.path || author.image || "",
    //       })
    //     );
    // }
    // Handle gallery images
    if ((_c = files["galleryImagesFiles"]) === null || _c === void 0 ? void 0 : _c.length) {
        const newGalleryImages = files["galleryImagesFiles"].map((f) => f.path);
        // Merge with existing gallery images (if provided)
        updatedData.gallery = Array.isArray(updatedData.gallery)
            ? [...updatedData.gallery, ...newGalleryImages]
            : newGalleryImages;
    }
    else if (updatedData.gallery) {
        try {
            updatedData.gallery = Array.isArray(updatedData.gallery)
                ? updatedData.gallery
                : JSON.parse(updatedData.gallery);
        }
        catch (_e) {
            updatedData.gallery = [updatedData.gallery];
        }
    }
    // Handle preview images
    if ((_d = files["previewImgFile"]) === null || _d === void 0 ? void 0 : _d.length) {
        const newPreviewImages = files["previewImgFile"].map((f) => f.path);
        // Merge with existing preview images (if provided)
        updatedData.previewImg = Array.isArray(updatedData.previewImg)
            ? [...updatedData.previewImg, ...newPreviewImages]
            : newPreviewImages;
    }
    else if (updatedData.previewImg) {
        try {
            updatedData.previewImg = Array.isArray(updatedData.previewImg)
                ? updatedData.previewImg
                : JSON.parse(updatedData.previewImg);
        }
        catch (_f) {
            updatedData.previewImg = [updatedData.previewImg];
        }
    }
    const result = yield product_service_1.productServices.updateProductOnDB(id, updatedData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Product updated successfully!",
        data: result,
    });
}));
const deleteSingleProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield product_service_1.productServices.deleteSingleProductOnDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Product deleted successfully!",
        data: result,
    });
}));
const searchProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { q } = req.query;
    const result = yield product_service_1.productServices.searchProductsFromDB(q);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: result.length
            ? "Products retrieved successfully!"
            : "No products found!",
        data: result,
    });
}));
const getProductsByAuthor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorId } = req.params;
    const result = yield product_service_1.productServices.getProductsByAuthorFromDB(authorId, req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Products by author retrieved successfully!",
        data: result.data,
        meta: result.meta,
    });
}));
exports.productControllers = {
    createProduct,
    getSingleProduct,
    deleteSingleProduct,
    searchProducts,
    getAllProduct,
    updateProduct,
    getProductsByCategoryandTag,
    getProductsByAuthor,
};
