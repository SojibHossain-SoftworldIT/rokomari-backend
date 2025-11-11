import httpStatus from "http-status";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import AppError from "../../errors/handleAppError";
import { TCategory } from "./category.interface";
import { CategoryModel } from "./category.model";

const getAllCategoryFromDB = async () => {
  return await CategoryModel.find();
};

const getSingleCategoryFromDB = async (id: string) => {
  return await CategoryModel.findById(id);
};

const feauturedCategoriesFromDB = async () => {
  return await CategoryModel.find({ feautured: true });
};

const createCategoryIntoDB = async (payload: TCategory) => {
  const isCategoryExists = await CategoryModel.findOne({ name: payload?.name });

  if (isCategoryExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Category with ${isCategoryExists?.name} already exists!`
    );
  }

  // slug
  payload.slug = payload.name.split(" ").join("-").toLowerCase();

  const result = await CategoryModel.create(payload);
  return result;
};

const updateCategoryInDB = async (id: string, payload: Partial<TCategory>) => {
  const isCategory = await CategoryModel.findById(id);
  if (!isCategory) throw new AppError(404, "Category not found!");

  if (payload.name) {
    payload.slug = payload.name.split(" ").join("-").toLowerCase();
    const exists = await CategoryModel.findOne({ name: payload?.name });
    if (exists && exists._id.toString() !== id) {
      throw new AppError(
        httpStatus.CONFLICT,
        `Category with ${exists?.name} already exists!`
      );
    }
  }

  // delete old image if new one uploaded
  if (payload.image && isCategory.image) {
    await deleteImageFromCLoudinary(isCategory.image);
  }

  const result = await CategoryModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteCategoryFromDB = async (id: string) => {
  const category = await CategoryModel.findByIdAndDelete(id);
  if (!category) throw new AppError(404, "Category not found!");

  // delete image from Cloudinary
  if (category.image) {
    await deleteImageFromCLoudinary(category.image);
  }
  return category;
};

export const categoryServices = {
  getAllCategoryFromDB,
  updateCategoryInDB,
  getSingleCategoryFromDB,
  feauturedCategoriesFromDB,
  createCategoryIntoDB,
  deleteCategoryFromDB,
};
