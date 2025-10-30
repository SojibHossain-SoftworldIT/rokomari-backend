import { Types } from "mongoose";

export type TCategoriesAndTags = {
  publisher?: string; // Name of the publisher
  categories: Types.ObjectId[];
  tags: Types.ObjectId[];
  subCategories?: string[];
};

// export type TCategoryAndTags = {
//   publisher: string; // Publisher name
//   categories: string[]; // e.g., Fiction, History
//   tags?: string[]; // keywords
// };

export type TDescription = {
  name: string; // Book title
  slug: string; // SEO-friendly URL slug
  description: string; // Book summary
  status: "publish" | "draft";
  name_bn?: string; // Bengali title
  description_bn?: string; // Bengali summary
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
};

export type TExternal = {
  productUrl: string;
  buttonLabel: string;
};

export type TProductInfo = {
  productTitle: string;
  price: number;
  brand?: Types.ObjectId;
  salePrice?: number;
  quantity: number;
  sku: string;
  weight?: string;
  dimensions?: {
    width?: string;
    height?: string;
    length?: string;
  };
  isDigital?: boolean;
  digital?: string;
  isExternal?: boolean;
  external?: TExternal;
  discount?: number;
  totalDiscount?: number;
  status: "draft" | "publish" | "low-quantity" | "out-of-stock";
  publicationDate?: Date;
  isOnSale?: boolean;
  campaign?: string;
  inStock?: boolean; // derived field
};

// export type TAuthor = {
//   name: string;
//   image?: string;
//   description?: string;
// };

export type TSpecification = {
  authors?: Types.ObjectId[]; // Array of author IDs
  publisher: string; // Publisher name
  edition?: string;
  editionYear?: number;
  numberOfPages: number;
  country: string;
  language: string;
  isbn?: string;
  binding?: "hardcover" | "paperback";
};

export type TBookInfo = {
  specification: TSpecification;
  format?: "hardcover" | "paperback" | "ebook" | "audiobook";
  genre?: string[];
  series?: string;
  translator?: string;
};

export type TProduct = {
  featuredImg: string;
  previewImg?: string[];
  gallery?: string[];
  video?: string;
  categoryAndTags: TCategoriesAndTags;
  description: TDescription;
  productType: "simple" | "variable";
  productInfo: TProductInfo;
  bookInfo: TBookInfo;
  averageRating?: number;
  ratingCount?: number;
  reviewCount?: number;
  wishlistCount?: number;
  soldCount?: number;
};
