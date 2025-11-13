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
exports.authorsControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const authors_service_1 = require("./authors.service");
const createAuthor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const files = req.files || {};
    const authorData = Object.assign(Object.assign({}, req.body), { image: ((_b = (_a = files["image"]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path) || req.body.image || "" });
    const result = yield authors_service_1.authorsServices.createAuthorIntoDB(authorData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Author created successfully!",
        data: result,
    });
}));
const getAllAuthors = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield authors_service_1.authorsServices.getAuthorsFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Authors retrieved successfully!",
        data: result,
    });
}));
const getSingleAuthor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield authors_service_1.authorsServices.getSingleAuthorFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Author retrieved successfully!",
        data: result,
    });
}));
const updateAuthor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.params;
    const files = req.files || {};
    const updatedData = Object.assign({}, req.body);
    if ((_b = (_a = files["image"]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path) {
        updatedData.image = files["image"][0].path;
    }
    else if (req.body.image) {
        updatedData.image = req.body.image;
    }
    const result = yield authors_service_1.authorsServices.updateAuthorInDB(id, updatedData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Author updated successfully!",
        data: result,
    });
}));
const deleteAuthor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield authors_service_1.authorsServices.deleteAuthorFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Author deleted successfully!",
        data: result,
    });
}));
// ✅ Custom endpoint for following an author (increment followers)
const followAuthor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield authors_service_1.authorsServices.updateAuthorInDB(id, {
        increaseFollowers: true,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Author followed successfully!",
        data: result,
    });
}));
exports.authorsControllers = {
    createAuthor,
    getAllAuthors,
    getSingleAuthor,
    updateAuthor,
    deleteAuthor,
    followAuthor,
};
