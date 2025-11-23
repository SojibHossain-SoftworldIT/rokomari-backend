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
exports.dynamicPagesControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const dynamic_pages_service_1 = require("./dynamic-pages.service");
const createDynamicPage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const files = req.files;
    const heroImage = ((_a = files === null || files === void 0 ? void 0 : files.heroImage) === null || _a === void 0 ? void 0 : _a.length) ? files.heroImage[0].path : undefined;
    const pageData = Object.assign(Object.assign({}, req.body), { heroImage });
    const result = yield dynamic_pages_service_1.dynamicPagesServices.createDynamicPageOnDB(pageData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Dynamic page created successfully!",
        data: result,
    });
}));
const getAllDynamicPages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield dynamic_pages_service_1.dynamicPagesServices.getAllDynamicPagesFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Dynamic pages retrieved successfully!",
        data: result,
    });
}));
const getDynamicPageById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield dynamic_pages_service_1.dynamicPagesServices.getDynamicPageByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Dynamic page retrieved successfully!",
        data: result,
    });
}));
const getDynamicPageBySlug = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const result = yield dynamic_pages_service_1.dynamicPagesServices.getDynamicPageBySlugFromDB(slug);
    if (!result) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_1.default.NOT_FOUND,
            message: "Page not found!",
            data: null,
        });
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Dynamic page retrieved successfully!",
        data: result,
    });
}));
const updateDynamicPage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const files = req.files;
    const updateData = Object.assign({}, req.body);
    if ((_a = files === null || files === void 0 ? void 0 : files.heroImage) === null || _a === void 0 ? void 0 : _a.length) {
        updateData.heroImage = files.heroImage[0].path;
    }
    const result = yield dynamic_pages_service_1.dynamicPagesServices.updateDynamicPageOnDB(id, updateData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Dynamic page updated successfully!",
        data: result,
    });
}));
const deleteDynamicPage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield dynamic_pages_service_1.dynamicPagesServices.deleteDynamicPageFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Dynamic page deleted successfully!",
        data: result,
    });
}));
exports.dynamicPagesControllers = {
    createDynamicPage,
    getAllDynamicPages,
    getDynamicPageById,
    getDynamicPageBySlug,
    updateDynamicPage,
    deleteDynamicPage,
};
