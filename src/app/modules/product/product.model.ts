import { model, Schema } from "mongoose";
import {
  TBrandAndCategories,
  TDescription,
  TExternal,
  TProduct,
  TProductInfo,
} from "./product.interface";

const brandAndCategorySchema = new Schema<TBrandAndCategories>(
  {
    brand: {
      type: Schema.Types.ObjectId,
      required: [true, "Brand is Required!"],
      ref: "brand",
    },
    categories: {
      type: [Schema.Types.ObjectId],
      required: [true, "Category is Required!"],
      ref: "category",
    },
    tags: {
      type: [Schema.Types.ObjectId],
      required: [true, "Tag is Required!"],
      ref: "tag",
    },
  },
  { _id: false } // Prevents creating a separate _id for icon
);

const descriptionSchema = new Schema<TDescription>(
  {
    name: {
      type: String,
      required: [true, "Name is Required!"],
    },
    slug: { type: String },
    unit: {
      type: String,
      required: [true, "Unit is Required!"],
    },
    description: {
      type: String,
      required: [true, "A small description is required!"],
    },
    status: {
      type: String,
      enum: ["publish", "draft"],
      required: [true, "Status is required!"],
      default: "draft",
    },
  },
  { _id: false } // Prevents creating a separate _id for icon
);

const externalSchema = new Schema<TExternal>(
  {
    productUrl: {
      type: String,
    },
    buttonLabel: {
      type: String,
    },
  },
  { _id: false } // Prevents creating a separate _id for icon
);

const productInfoSchema = new Schema<TProductInfo>(
  {
    price: {
      type: Number,
      required: [true, "Price is Required!"],
    },
    salePrice: {
      type: Number,
      required: [true, "Sale price is Required!"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is Required!"],
    },
    size: {type: String},
    sku: {
      type: String,
      required: [true, "sku is Required!"],
    },
    width: {
      type: String,
      required: [true, "Width is Required!"],
    },
    height: {
      type: String,
      required: [true, "Height is Required!"],
    },
    length: {
      type: String,
      required: [true, "Length is Required!"],
    },
    isDigital: {
      type: Boolean,
    },
    digital: {
      type: String,
    },
    isExternal: {
      type: Boolean,
    },
    external: externalSchema,
    discount : {type: Number, default: 0},
    status: {
      type: String,
      enum: ["draft", "publish", "low-quantity"],
      required: [true, "Status is Required!"],
    },
  },
  {
    timestamps: true,
  }
);


const AuthorSchema = new Schema(
  {
    name: { type: String },
    image: { type: String },
    description: {type: String}
  },
  { _id: false }
);


const SpecificationSchema = new Schema(
  {
    title: { type: String },
    Author: { type: AuthorSchema },
    Publisher: { type: String },
    edition: { type: String },
    numberOfPages: { type: Number },
    country: { type: String },
    language: { type: String },
  },
  { _id: false }
);

// BookInfo SubSchema
export const BookInfoSchema = new Schema(
  {
    specification: { type: SpecificationSchema },
    format: {
      type: String,
      enum: ["hardcover", "paperback", "ebook", "audiobook"],
    },
    genre: [{ type: String }],
    pages: { type: Number },
    isbn: { type: String },
  },
  { _id: false }
);

const productSchema = new Schema<TProduct>(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      required: [true, "ShopId is Required!"],
    },
    featuredImg: {
      type: String,
      required: [true, "Feature image is Required!"],
    },
    gallery: {
      type: [String],
      required: [true, "Gallery is Required!"],
      default: [],
    },
    video: {
      type: String,
    },
    brandAndCategories: brandAndCategorySchema,
    description: descriptionSchema,
    productType: {
      type: String,
      enum: ["simple", "variable"],
      required: [true, "Product type is Required!"],
    },
    productInfo: productInfoSchema,
    bookInfo: { type: BookInfoSchema },

  },
  {
    timestamps: true,
  }
);

export const ProductModel = model<TProduct>("product", productSchema);
