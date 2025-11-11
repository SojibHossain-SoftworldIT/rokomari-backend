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
exports.authorsServices = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const authors_model_1 = require("./authors.model");
// ✅ Create Author (with image upload)
const createAuthorIntoDB = (authorData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield authors_model_1.AuthorModel.create(authorData);
    return result;
});
// ✅ Get All Authors
const getAuthorsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield authors_model_1.AuthorModel.find();
});
// ✅ Get Single Author by ID
const getSingleAuthorFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield authors_model_1.AuthorModel.findById(id);
});
// ✅ Update Author (supports image upload & follower count increment)
const updateAuthorInDB = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const author = yield authors_model_1.AuthorModel.findById(id);
    if (!author)
        throw new handleAppError_1.default(404, "Author not found!");
    // Handle image replacement
    if (updatedData.image && author.image && updatedData.image !== author.image) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(author.image);
    }
    // Handle follower increment (optional flag)
    if (updatedData.increaseFollowers) {
        updatedData.followersCount = (author.followersCount || 0) + 1;
    }
    const updatedAuthor = yield authors_model_1.AuthorModel.findByIdAndUpdate(id, { $set: updatedData }, { new: true, runValidators: true });
    return updatedAuthor;
});
// ✅ Delete Author (and image from Cloudinary)
const deleteAuthorFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const author = yield authors_model_1.AuthorModel.findByIdAndDelete(id);
    if (!author)
        throw new handleAppError_1.default(404, "Author not found!");
    if (author.image) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(author.image);
    }
    return author;
});
exports.authorsServices = {
    createAuthorIntoDB,
    getAuthorsFromDB,
    getSingleAuthorFromDB,
    updateAuthorInDB,
    deleteAuthorFromDB,
};
