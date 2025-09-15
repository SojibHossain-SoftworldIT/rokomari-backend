import AppError from "../../errors/handleAppError";
import httpStatus from "http-status";
import { TagModel } from "./tags.model";
import { TTag } from "./tags.interface";

const getAllTagsFromDB = async () => {
  const result = await TagModel.find();

  return result;
};

const getSingleTagFromDB = async (id: string) => {
  const result = await TagModel.findById(id);

  return result;
};

const createTagOnDB = async (payload: TTag) => {
  const isTagExists = await TagModel.findOne({ name: payload?.name });

  if (isTagExists) {
    throw new AppError(httpStatus.CONFLICT, "Tag Already Exists!");
  }

  payload.slug = payload?.name.split(" ").join("-");

  const result = await TagModel.create(payload);

  return result;
};

export const tagServices = {
  getAllTagsFromDB,
  getSingleTagFromDB,
  createTagOnDB,
};
