type TIcon = {
  name?: string;
  url?: string;
};

export type TCategory = {
  mainCategory: string;
  name: string;
  slug?: string;
  details: string;
  icon?: TIcon;
  image: string;
  bannerImg: string;
  subCategories: string[];
};
