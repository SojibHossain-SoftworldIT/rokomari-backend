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
exports.reviewControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const review_service_1 = require("./review.service");
// ✅ Create Review
const createReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files || {};
    const photos = files["photos"] ? files["photos"].map((f) => f.path) : [];
    const reviewData = Object.assign(Object.assign({}, req.body), { photos });
    const result = yield review_service_1.reviewServices.createReviewOnDB(reviewData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Review created successfully! Waiting for admin approval.",
        data: result,
    });
}));
// ✅ Get all reviews
const getAllReviews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.reviewServices.getAllReviewsFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Reviews retrieved successfully!",
        data: result,
    });
}));
// ✅ Get single review
const getSingleReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield review_service_1.reviewServices.getSingleReviewFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Review retrieved successfully!",
        data: result,
    });
}));
// ✅ Get approved reviews for product
const getApprovedReviewsByProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const result = yield review_service_1.reviewServices.getApprovedReviewsForProduct(productId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Approved reviews retrieved successfully!",
        data: result,
    });
}));
// ✅ Update review
const updateReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const files = req.files;
    const updatedData = Object.assign({}, req.body);
    // if (files?.photos?.length) {
    //   updatedData.photos = files.photos.map((f) => f.path);
    // }
    // Handle gallery images
    if ((_a = files["photos"]) === null || _a === void 0 ? void 0 : _a.length) {
        const newPhotosImages = files["photos"].map((f) => f.path);
        // Merge with existing gallery images (if provided)
        updatedData.photos = Array.isArray(updatedData.photos)
            ? [...updatedData.photos, ...newPhotosImages]
            : newPhotosImages;
    }
    else if (updatedData.photos) {
        try {
            updatedData.photos = Array.isArray(updatedData.photos)
                ? updatedData.photos
                : JSON.parse(updatedData.photos);
        }
        catch (_b) {
            updatedData.photos = [updatedData.photos];
        }
    }
    const result = yield review_service_1.reviewServices.updateReviewOnDB(id, updatedData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Review updated successfully!",
        data: result,
    });
}));
// ✅ Delete review
const deleteReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield review_service_1.reviewServices.deleteReviewFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Review deleted successfully!",
        data: result,
    });
}));
exports.reviewControllers = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    getApprovedReviewsByProduct,
};
