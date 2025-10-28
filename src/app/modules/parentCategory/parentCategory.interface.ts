import { Types } from "mongoose";

export type TParentCategory = {
  name: string;
  categories: Types.ObjectId[];
};
