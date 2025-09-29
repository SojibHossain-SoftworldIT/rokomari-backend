import httpStatus from "http-status";
import AppError from "../../errors/handleAppError";
import { TCategory } from "./category.interface";
import { CategoryModel } from "./category.model";

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

//update single category

const updateCategoryInDB = async (id: string, payload: Partial<TCategory>) => {
  const isCategoryExists = await CategoryModel.findOne({ name: payload?.name });

  //creating slug
  if (payload.name) {
    payload.slug = payload.name.split(" ").join("-").toLowerCase();
  }

  if (isCategoryExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Category with ${isCategoryExists?.name} is already exists!`
    );
  }

  const result = await CategoryModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

//delete single category
const deleteCategoryFromDB = async (id: string) => {
  const result = await CategoryModel.findByIdAndDelete(id);
  return result;
};

export const categoryServices = {
  getAllCategoryFromDB,
  updateCategoryInDB,
  getSingleCategoryFromDB,
  createCategoryIntoDB,
  deleteCategoryFromDB,
};
