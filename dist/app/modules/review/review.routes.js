"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_config_1 = require("../../config/multer.config");
const review_controller_1 = require("./review.controller");
const router = express_1.default.Router();
// upload up to 5 review photos
const uploadFields = multer_config_1.multerUpload.fields([{ name: "photos", maxCount: 5 }]);
router.get("/", review_controller_1.reviewControllers.getAllReviews);
router.get("/:id", review_controller_1.reviewControllers.getSingleReview);
router.get("/product/:productId", review_controller_1.reviewControllers.getApprovedReviewsByProduct);
router.post("/", uploadFields, review_controller_1.reviewControllers.createReview);
router.patch("/:id", uploadFields, review_controller_1.reviewControllers.updateReview);
router.delete("/:id", review_controller_1.reviewControllers.deleteReview);
exports.reviewRoutes = router;
