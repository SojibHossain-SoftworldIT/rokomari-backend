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
        data: result,
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
            : req.body.gallery || [] });
    const result = yield product_service_1.productServices.createProductOnDB(productData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Product created successfully!",
        data: result,
    });
}));
const updateProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { id } = req.params;
    const files = req.files;
    const updatedData = Object.assign({}, req.body);
    if ((_b = (_a = files["featuredImgFile"]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path) {
        updatedData.featuredImg = files["featuredImgFile"][0].path;
    }
    if ((_c = files["galleryImagesFiles"]) === null || _c === void 0 ? void 0 : _c.length) {
        updatedData.gallery = files["galleryImagesFiles"].map((f) => f.path);
    }
    const result = yield product_service_1.productServices.updateProductOnDB(id, updatedData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Product updated successfully!",
        data: result,
    });
}));
// Product delete controller
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
exports.productControllers = {
    createProduct,
    getSingleProduct,
    deleteSingleProduct,
    searchProducts,
    getAllProduct,
    updateProduct,
    getProductsByCategoryandTag,
};
