import { Types } from "mongoose";

export type TReview = {
  user: Types.ObjectId;
  product: Types.ObjectId;
  rating: number;
  description?: string;
  photos?: string[]; // max 5 photo URLs
  status?: "pending" | "approved" | "rejected";
};
