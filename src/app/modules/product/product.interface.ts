import { Types } from "mongoose";

export type TBrandAndCategories = {
  brand: Types.ObjectId;
  categories: Types.ObjectId[];
  tags: Types.ObjectId[];
};

export type TDescription = {
  name: string;
  slug?: string;
  unit: string;
  description: string;
  status: "publish" | "draft";
};

export type TExternal = {
  productUrl: string;
  buttonLabel: string;
};

export type TProductInfo = {
  price: number;
  salePrice: number;
  quantity: number;
  size: string;
  sku: string;
  width: string;
  height: string;
  length: string;
  isDigital?: boolean;
  digital?: string;
  isExternal?: boolean;
  external?: TExternal;
  discount?: number;
  status: 'draft' | 'publish' | 'low-quantity';
};

export type TAuthor = {
  name: string;
  image: string;
  description: string;
}


export type TSpecification = {
  title: string;
  Author: TAuthor;
  Publisher: string;
  edition: string;
  numberOfPages: number;
  country: string;
  language: string;
};


export type TBookInfo = {
  specification: TSpecification;
  format?: 'hardcover' | 'paperback' | 'ebook' | 'audiobook';
  genre?: string[];
  pages?: number;
  isbn?: string;
};

export type TProduct = {
  shopId: Types.ObjectId;
  featuredImg: string;
  gallery: string[];
  video?: string;
  brandAndCategories: TBrandAndCategories;
  description: TDescription;
  productType: 'simple' | 'variable';
  productInfo: TProductInfo;
  deletedImages?: string[];
  bookInfo?: TBookInfo;
};
