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
exports.tagControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const tags_services_1 = require("./tags.services");
const getAllTags = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tags_services_1.tagServices.getAllTagsFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Tags retrieved successfully!",
        data: result,
    });
}));
const getSingleTag = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield tags_services_1.tagServices.getSingleTagFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Tag retrieved successfully!",
        data: result,
    });
}));
// const createTag = catchAsync(async (req, res) => {
//   const files =
//     (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};
//   const tagData = {
//     ...req.body,
//     image: files["imageFile"]?.[0]?.path || req.body.image || "",
//   };
//   const result = await tagServices.createTagOnDB(tagData);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.CREATED,
//     message: "Tag created successfully!",
//     data: result,
//   });
// });
// const updateTag = catchAsync(async (req, res) => {
//   const id = req.params.id;
//   const files =
//     (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};
//   const updatedData: any = { ...req.body };
//   if (files["imageFile"]?.[0]?.path) {
//     updatedData.image = files["imageFile"][0].path;
//   }
//   const result = await tagServices.updateTagInDB(id, updatedData);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Tag updated successfully!",
//     data: result,
//   });
// });
const createTag = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const files = req.files || {};
    const tagData = Object.assign(Object.assign({}, req.body), { image: ((_b = (_a = files["imageFile"]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path) || req.body.image || "", icon: {
            name: req.body.iconName || "",
            url: ((_d = (_c = files["iconFile"]) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.path) || req.body.iconUrl || "",
        } });
    const result = yield tags_services_1.tagServices.createTagOnDB(tagData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Tag created successfully!",
        data: result,
    });
}));
// const updateTag = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const files =
//     (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};
//   const updatedData: any = { ...req.body };
//   if (files["imageFile"]?.[0]?.path) {
//     updatedData.image = files["imageFile"][0].path;
//   }
//   if (files["iconFile"]?.[0]?.path) {
//     updatedData.icon = {
//       name: req.body.iconName || "",
//       url: files["iconFile"][0].path,
//     };
//   }
//   const result = await tagServices.updateTagInDB(id, updatedData);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Tag updated successfully!",
//     data: result,
//   });
// });
const updateTag = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { id } = req.params;
    const files = req.files || {};
    const updatedData = Object.assign({}, req.body);
    if ((_b = (_a = files["imageFile"]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path) {
        updatedData.image = files["imageFile"][0].path;
    }
    else if (req.body.imageFile) {
        updatedData.image = (_c = req.body) === null || _c === void 0 ? void 0 : _c.imageFile;
    }
    if ((_e = (_d = files["iconFile"]) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.path) {
        updatedData.icon = {
            name: req.body.iconName || "",
            url: files["iconFile"][0].path,
        };
    }
    else if (req.body.iconFile || req.body.iconName) {
        updatedData.icon = {
            name: req.body.iconName || "",
            url: req.body.iconFile || "",
        };
    }
    const result = yield tags_services_1.tagServices.updateTagInDB(id, updatedData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Tag updated successfully!",
        data: result,
    });
}));
const deleteTag = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield tags_services_1.tagServices.deleteTagFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Tag deleted successfully!",
        data: result,
    });
}));
exports.tagControllers = {
    getAllTags,
    getSingleTag,
    createTag,
    updateTag,
    deleteTag,
};
