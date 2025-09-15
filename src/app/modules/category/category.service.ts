import AppError from "../../errors/handleAppError";
import { TCategory } from "./category.interface";
import { CategoryModel } from "./category.model";
import httpStatus from "http-status";

const getAllCategoryFromDB = async () => {
  const result = await CategoryModel.find();
  return result;
};

const getSingleCategoryFromDB = async (id: string) => {
  const result = await CategoryModel.findById(id);
  return result;
};

const createCategoryIntoDB = async (payload: TCategory) => {
  const isCategoryExists = await CategoryModel.findOne({ name: payload?.name });

  //creating slug
  payload.slug = payload.name.split(" ").join("-").toLowerCase();

  if (isCategoryExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Category with ${isCategoryExists?.name} is already exists!`
    );
  }
  const result = await CategoryModel.create(payload);
  return result;
};

const deleteCategoryFromDB = async (id: string) => {
  const result = await CategoryModel.findByIdAndDelete(id);
  return result;
};

export const categoryServices = {
  getAllCategoryFromDB,
  getSingleCategoryFromDB,
  createCategoryIntoDB,
  deleteCategoryFromDB,
};
