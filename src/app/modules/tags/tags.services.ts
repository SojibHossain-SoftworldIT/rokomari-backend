import httpStatus from "http-status";
import AppError from "../../errors/handleAppError";
import { TTag } from "./tags.interface";
import { TagModel } from "./tags.model";

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

//update single tag
const updateTagInDB = async (id: string, payload: Partial<TTag>) => {
  const isTagExists = await TagModel.findOne({ name: payload?.name });

  //creating slug
  if (payload.name) {
    payload.slug = payload.name.split(" ").join("-").toLowerCase();
  }

  if (isTagExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Tag with ${isTagExists?.name} is already exists!`
    );
  }

  const result = await TagModel.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

//delete single tag
const deleteTagFromDB = async (id: string) => {
  const result = await TagModel.findByIdAndDelete(id);
  return result;
};

export const tagServices = {
  getAllTagsFromDB,
  getSingleTagFromDB,
  updateTagInDB,
  deleteTagFromDB,
  createTagOnDB,
};
