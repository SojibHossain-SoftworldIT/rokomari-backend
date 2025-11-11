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
exports.categoryServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const cloudinary_config_1 = require("../../config/cloudinary.config");
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const category_model_1 = require("./category.model");
const getAllCategoryFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield category_model_1.CategoryModel.find();
});
const getSingleCategoryFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield category_model_1.CategoryModel.findById(id);
});
const feauturedCategoriesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield category_model_1.CategoryModel.find({ feautured: true });
});
const createCategoryIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryExists = yield category_model_1.CategoryModel.findOne({ name: payload === null || payload === void 0 ? void 0 : payload.name });
    if (isCategoryExists) {
        throw new handleAppError_1.default(http_status_1.default.CONFLICT, `Category with ${isCategoryExists === null || isCategoryExists === void 0 ? void 0 : isCategoryExists.name} already exists!`);
    }
    // slug
    payload.slug = payload.name.split(" ").join("-").toLowerCase();
    const result = yield category_model_1.CategoryModel.create(payload);
    return result;
});
const updateCategoryInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategory = yield category_model_1.CategoryModel.findById(id);
    if (!isCategory)
        throw new handleAppError_1.default(404, "Category not found!");
    if (payload.name) {
        payload.slug = payload.name.split(" ").join("-").toLowerCase();
        const exists = yield category_model_1.CategoryModel.findOne({ name: payload === null || payload === void 0 ? void 0 : payload.name });
        if (exists && exists._id.toString() !== id) {
            throw new handleAppError_1.default(http_status_1.default.CONFLICT, `Category with ${exists === null || exists === void 0 ? void 0 : exists.name} already exists!`);
        }
    }
    // delete old image if new one uploaded
    if (payload.image && isCategory.image) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(isCategory.image);
    }
    const result = yield category_model_1.CategoryModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteCategoryFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.CategoryModel.findByIdAndDelete(id);
    if (!category)
        throw new handleAppError_1.default(404, "Category not found!");
    // delete image from Cloudinary
    if (category.image) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(category.image);
    }
    return category;
});
exports.categoryServices = {
    getAllCategoryFromDB,
    updateCategoryInDB,
    getSingleCategoryFromDB,
    feauturedCategoriesFromDB,
    createCategoryIntoDB,
    deleteCategoryFromDB,
};
