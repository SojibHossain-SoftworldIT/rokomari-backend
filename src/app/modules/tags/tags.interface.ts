type TIcon = {
  name?: string;
  url?: string;
};

export type TTag = {
  name: string;
  slug?: string;
  details: string;
  icon?: TIcon;
  image: string;
};
