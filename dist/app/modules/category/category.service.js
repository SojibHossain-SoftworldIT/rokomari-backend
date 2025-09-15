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
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const category_model_1 = require("./category.model");
const http_status_1 = __importDefault(require("http-status"));
const getAllCategoryFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.CategoryModel.find();
    return result;
});
const getSingleCategoryFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.CategoryModel.findById(id);
    return result;
});
const createCategoryIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryExists = yield category_model_1.CategoryModel.findOne({ name: payload === null || payload === void 0 ? void 0 : payload.name });
    //creating slug
    payload.slug = payload.name.split(" ").join("-").toLowerCase();
    if (isCategoryExists) {
        throw new handleAppError_1.default(http_status_1.default.CONFLICT, `Category with ${isCategoryExists === null || isCategoryExists === void 0 ? void 0 : isCategoryExists.name} is already exists!`);
    }
    const result = yield category_model_1.CategoryModel.create(payload);
    return result;
});
const deleteCategoryFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.CategoryModel.findByIdAndDelete(id);
    return result;
});
exports.categoryServices = {
    getAllCategoryFromDB,
    getSingleCategoryFromDB,
    createCategoryIntoDB,
    deleteCategoryFromDB,
};
