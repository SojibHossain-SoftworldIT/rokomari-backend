// Author Schema

import { model, Schema } from "mongoose";
import { TAuthor } from "./authors.interface";

const authorModel = new Schema<TAuthor>({
  name: { type: String, required: true },
  image: String,
  followersCount: { type: Number, default: 0 },
  description: String,
});

export const AuthorModel = model<TAuthor>("Author", authorModel);
