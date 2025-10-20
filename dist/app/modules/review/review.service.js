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
exports.reviewServices = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const review_model_1 = require("./review.model");
// ✅ Create review
const createReviewOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.ReviewModel.create(payload);
    return result;
});
// ✅ Get all reviews
const getAllReviewsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return review_model_1.ReviewModel.find()
        .populate("user", "name email")
        .populate("product", "description.name");
});
// ✅ Get single review by ID
const getSingleReviewFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return review_model_1.ReviewModel.findById(id)
        .populate("user", "name email")
        .populate("product", "description.name");
});
// ✅ Get approved reviews for a specific product
const getApprovedReviewsForProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    return review_model_1.ReviewModel.find({ product: productId, status: "approved" })
        .populate("user", "name email")
        .sort({ createdAt: -1 });
});
// ✅ Update review
const updateReviewOnDB = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const review = yield review_model_1.ReviewModel.findById(id);
    if (!review)
        throw new handleAppError_1.default(404, "Review not found!");
    // Handle photo deletion if any
    if (((_a = updatedData.deletedPhotos) === null || _a === void 0 ? void 0 : _a.length) > 0 && ((_b = review.photos) === null || _b === void 0 ? void 0 : _b.length)) {
        const restPhotos = review.photos.filter((img) => { var _a; return !((_a = updatedData.deletedPhotos) === null || _a === void 0 ? void 0 : _a.includes(img)); });
        const updatedPhotos = (updatedData.photos || [])
            .filter((img) => { var _a; return !((_a = updatedData.deletedPhotos) === null || _a === void 0 ? void 0 : _a.includes(img)); })
            .filter((img) => !restPhotos.includes(img));
        updatedData.photos = [...restPhotos, ...updatedPhotos];
        yield Promise.all(updatedData.deletedPhotos.map((img) => (0, cloudinary_config_1.deleteImageFromCLoudinary)(img)));
    }
    const updatedReview = yield review_model_1.ReviewModel.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true,
    });
    return updatedReview;
});
// ✅ Delete review
const deleteReviewFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.ReviewModel.findByIdAndDelete(id);
    if (!review)
        throw new handleAppError_1.default(404, "Review not found!");
    return review;
});
exports.reviewServices = {
    createReviewOnDB,
    getAllReviewsFromDB,
    getSingleReviewFromDB,
    updateReviewOnDB,
    deleteReviewFromDB,
    getApprovedReviewsForProduct,
};
