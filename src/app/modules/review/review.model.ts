import { Schema, model } from "mongoose";
import { TReview } from "./review.interface";

const reviewSchema = new Schema<TReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    description: { type: String, trim: true },
    photos: {
      type: [String],
      validate: [
        (val: string[]) => val.length <= 5,
        "Maximum 5 photos allowed",
      ],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const ReviewModel = model<TReview>("Review", reviewSchema);
