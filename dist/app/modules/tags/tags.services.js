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
exports.tagServices = void 0;
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const http_status_1 = __importDefault(require("http-status"));
const tags_model_1 = require("./tags.model");
const getAllTagsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tags_model_1.TagModel.find();
    return result;
});
const getSingleTagFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tags_model_1.TagModel.findById(id);
    return result;
});
const createTagOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isTagExists = yield tags_model_1.TagModel.findOne({ name: payload === null || payload === void 0 ? void 0 : payload.name });
    if (isTagExists) {
        throw new handleAppError_1.default(http_status_1.default.CONFLICT, "Tag Already Exists!");
    }
    payload.slug = payload === null || payload === void 0 ? void 0 : payload.name.split(" ").join("-");
    const result = yield tags_model_1.TagModel.create(payload);
    return result;
});
exports.tagServices = {
    getAllTagsFromDB,
    getSingleTagFromDB,
    createTagOnDB,
};
