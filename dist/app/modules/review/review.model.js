"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModel = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "user", required: true },
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    description: { type: String, trim: true },
    photos: {
        type: [String],
        validate: [
            (val) => val.length <= 5,
            "Maximum 5 photos allowed",
        ],
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
}, { timestamps: true });
exports.ReviewModel = (0, mongoose_1.model)("Review", reviewSchema);
