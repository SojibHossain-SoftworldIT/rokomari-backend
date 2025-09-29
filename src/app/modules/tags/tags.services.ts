import httpStatus from "http-status";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import AppError from "../../errors/handleAppError";
import { TTag } from "./tags.interface";
import { TagModel } from "./tags.model";

const getAllTagsFromDB = async () => {
  return await TagModel.find();
};

const getSingleTagFromDB = async (id: string) => {
  return await TagModel.findById(id);
};

const createTagOnDB = async (payload: TTag) => {
  const isTagExists = await TagModel.findOne({ name: payload?.name });
  if (isTagExists) {
    throw new AppError(httpStatus.CONFLICT, "Tag already exists!");
  }

  payload.slug = payload?.name.split(" ").join("-").toLowerCase();
  const result = await TagModel.create(payload);
  return result;
};

const updateTagInDB = async (id: string, payload: Partial<TTag>) => {
  const tag = await TagModel.findById(id);
  if (!tag) throw new AppError(404, "Tag not found!");

  if (payload.name) {
    payload.slug = payload.name.split(" ").join("-").toLowerCase();
    const exists = await TagModel.findOne({ name: payload?.name });
    if (exists && exists._id.toString() !== id) {
      throw new AppError(
        httpStatus.CONFLICT,
        `Tag with ${exists?.name} already exists!`
      );
    }
  }

  // replace image if new one uploaded
  if (payload.image && tag.image) {
    await deleteImageFromCLoudinary(tag.image);
  }

  const result = await TagModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteTagFromDB = async (id: string) => {
  const tag = await TagModel.findByIdAndDelete(id);
  if (!tag) throw new AppError(404, "Tag not found!");

  if (tag.image) {
    await deleteImageFromCLoudinary(tag.image);
  }
  return tag;
};

export const tagServices = {
  getAllTagsFromDB,
  getSingleTagFromDB,
  updateTagInDB,
  deleteTagFromDB,
  createTagOnDB,
};
