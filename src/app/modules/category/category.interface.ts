type TIcon = {
  name?: string;
  url?: string;
};

export type TCategory = {
  mainCategory:
    | "book"
    | "electronics"
    | "superstore"
    | "kids-zone"
    | "corporate-order"
    | "best-seller-award"
    | "offer"
    | "just-for-you";
  name: string;
  feautured?: boolean;
  slug?: string;
  details: string;
  icon?: TIcon;
  image: string;
  bannerImg: string;
  subCategories: string[];
};
