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
exports.categoryControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const category_service_1 = require("./category.service");
const getAllCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_service_1.categoryServices.getAllCategoryFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Categories retrieved successfully!",
        data: result,
    });
}));
const getSingleCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield category_service_1.categoryServices.getSingleCategoryFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Category retrieved successfully!",
        data: result,
    });
}));
const getFeauturedCategories = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_service_1.categoryServices.feauturedCategoriesFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Feautured categories retrieved successfully!",
        data: result,
    });
}));
// const createCategory = catchAsync(async (req, res) => {
//   const files =
//     (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};
//   const categoryData = {
//     ...req.body,
//     image: files["imageFile"]?.[0]?.path || req.body.image || "",
//   };
//   const result = await categoryServices.createCategoryIntoDB(categoryData);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.CREATED,
//     message: "Category created successfully!",
//     data: result,
//   });
// });
// const updateCategory = catchAsync(async (req, res) => {
//   const id = req.params.id;
//   const files =
//     (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};
//   const updatedData: any = { ...req.body };
//   if (files["imageFile"]?.[0]?.path) {
//     updatedData.image = files["imageFile"][0].path;
//   }
//   const result = await categoryServices.updateCategoryInDB(id, updatedData);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Category updated successfully!",
//     data: result,
//   });
// });
const createCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const files = req.files || {};
    const categoryData = Object.assign(Object.assign({}, req.body), { image: ((_b = (_a = files["imageFile"]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path) || req.body.image || "", bannerImg: ((_d = (_c = files["bannerImgFile"]) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.path) || req.body.bannerImg || "", icon: {
            name: req.body.iconName || "",
            url: ((_f = (_e = files["iconFile"]) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.path) || req.body.iconUrl || "",
        } });
    const result = yield category_service_1.categoryServices.createCategoryIntoDB(categoryData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Category created successfully!",
        data: result,
    });
}));
// const updateCategory = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const files =
//     (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};
//   const updatedData: any = { ...req.body };
//   if (files["imageFile"]?.[0]?.path) {
//     updatedData.image = files["imageFile"][0].path;
//   }
//   if (files["bannerImgFile"]?.[0]?.path) {
//     updatedData.bannerImg = files["bannerImgFile"][0].path;
//   }
//   if (files["iconFile"]?.[0]?.path) {
//     updatedData.icon = {
//       name: req.body.iconName || "",
//       url: files["iconFile"][0].path,
//     };
//   }
//   const result = await categoryServices.updateCategoryInDB(id, updatedData);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Category updated successfully!",
//     data: result,
//   });
// });
const updateCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const { id } = req.params;
    const files = req.files || {};
    const updatedData = Object.assign({}, req.body);
    // handle files
    if ((_b = (_a = files["imageFile"]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path) {
        updatedData.image = files["imageFile"][0].path;
    }
    else if (req.body.imageFile) {
        updatedData.image = req.body.imageFile;
    }
    if ((_d = (_c = files["bannerImgFile"]) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.path) {
        updatedData.bannerImg = files["bannerImgFile"][0].path;
    }
    else if (req.body.bannerImgFile) {
        updatedData.bannerImg = req.body.bannerImgFile;
    }
    if ((_f = (_e = files["iconFile"]) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.path) {
        updatedData.icon = {
            name: req.body.iconName || "",
            url: files["iconFile"][0].path,
        };
    }
    else if (req.body.iconUrl || req.body.iconName) {
        updatedData.icon = {
            name: req.body.iconName || "",
            url: req.body.iconUrl || "",
        };
    }
    const result = yield category_service_1.categoryServices.updateCategoryInDB(id, updatedData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Category updated successfully!",
        data: result,
    });
}));
const deleteCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield category_service_1.categoryServices.deleteCategoryFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Category deleted successfully!",
        data: result,
    });
}));
exports.categoryControllers = {
    getAllCategory,
    getSingleCategory,
    getFeauturedCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};
