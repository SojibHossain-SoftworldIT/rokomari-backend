export type TAttributesArr = {
  value: string;
  meta: string;
};

export type TAttributes = {
  name: string;
  slug?: string;
  attributes: TAttributesArr[];
};
