import { model, Schema } from "mongoose";
import { TParentCategory } from "./parentCategory.interface";

const parentCategorySchema = new Schema<TParentCategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    categories: [
      { type: Schema.Types.ObjectId, ref: "category", required: true },
    ],
  },
  {
    timestamps: true,
  }
);

export const parentCategoryModel = model<TParentCategory>(
  "ParentCategory",
  parentCategorySchema
);
