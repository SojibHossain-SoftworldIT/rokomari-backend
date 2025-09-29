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
const http_status_1 = __importDefault(require("http-status"));
const cloudinary_config_1 = require("../../config/cloudinary.config");
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const tags_model_1 = require("./tags.model");
const getAllTagsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield tags_model_1.TagModel.find();
});
const getSingleTagFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tags_model_1.TagModel.findById(id);
});
const createTagOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isTagExists = yield tags_model_1.TagModel.findOne({ name: payload === null || payload === void 0 ? void 0 : payload.name });
    if (isTagExists) {
        throw new handleAppError_1.default(http_status_1.default.CONFLICT, "Tag already exists!");
    }
    payload.slug = payload === null || payload === void 0 ? void 0 : payload.name.split(" ").join("-").toLowerCase();
    const result = yield tags_model_1.TagModel.create(payload);
    return result;
});
const updateTagInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const tag = yield tags_model_1.TagModel.findById(id);
    if (!tag)
        throw new handleAppError_1.default(404, "Tag not found!");
    if (payload.name) {
        payload.slug = payload.name.split(" ").join("-").toLowerCase();
        const exists = yield tags_model_1.TagModel.findOne({ name: payload === null || payload === void 0 ? void 0 : payload.name });
        if (exists && exists._id.toString() !== id) {
            throw new handleAppError_1.default(http_status_1.default.CONFLICT, `Tag with ${exists === null || exists === void 0 ? void 0 : exists.name} already exists!`);
        }
    }
    // replace image if new one uploaded
    if (payload.image && tag.image) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(tag.image);
    }
    const result = yield tags_model_1.TagModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteTagFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const tag = yield tags_model_1.TagModel.findByIdAndDelete(id);
    if (!tag)
        throw new handleAppError_1.default(404, "Tag not found!");
    if (tag.image) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(tag.image);
    }
    return tag;
});
exports.tagServices = {
    getAllTagsFromDB,
    getSingleTagFromDB,
    updateTagInDB,
    deleteTagFromDB,
    createTagOnDB,
};
