import { Schema, model } from "mongoose";
import { TDynamicPage } from "./dynamic-pages.interface";

const dynamicPageSchema = new Schema<TDynamicPage>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    pageTitle: { type: String, trim: true },
    pageDescription: { type: String },
    heroImage: { type: String },
    pageContent: { type: String },
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const DynamicPageModel = model<TDynamicPage>("DynamicPage", dynamicPageSchema);