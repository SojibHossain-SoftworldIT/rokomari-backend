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
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicPagesServices = void 0;
const dynamic_pages_model_1 = require("./dynamic-pages.model");
const createDynamicPageOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield dynamic_pages_model_1.DynamicPageModel.create(payload);
    return result;
});
const getAllDynamicPagesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield dynamic_pages_model_1.DynamicPageModel.find().sort({ createdAt: -1 });
    return result;
});
const getDynamicPageByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield dynamic_pages_model_1.DynamicPageModel.findById(id);
    return result;
});
const getDynamicPageBySlugFromDB = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield dynamic_pages_model_1.DynamicPageModel.findOne({ slug, isActive: true });
    return result;
});
const updateDynamicPageOnDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield dynamic_pages_model_1.DynamicPageModel.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const deleteDynamicPageFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield dynamic_pages_model_1.DynamicPageModel.findByIdAndDelete(id);
    return result;
});
exports.dynamicPagesServices = {
    createDynamicPageOnDB,
    getAllDynamicPagesFromDB,
    getDynamicPageByIdFromDB,
    getDynamicPageBySlugFromDB,
    updateDynamicPageOnDB,
    deleteDynamicPageFromDB,
};
