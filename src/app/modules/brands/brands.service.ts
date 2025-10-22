import httpStatus from "http-status";
import AppError from "../../errors/handleAppError";
import { TBrands } from "./brands.interface";
import { BrandModel } from "./brands.model";

const getAllBrandsFromDB = async () => {
  const result = await BrandModel.find();

  return result;
};

const getSingleBrandFromDB = async (id: string) => {
  const result = await BrandModel.findById(id);

  return result;
};

const createBrandOnDB = async (payload: TBrands) => {
  const isBrandExists = await BrandModel.findOne({ name: payload?.name });

  if (isBrandExists) {
    throw new AppError(httpStatus.CONFLICT, "Brand Already Exists!");
  }

  const result = await BrandModel.create(payload);

  return result;
};

const updateBrandOnDB = async (id: string, payload: Partial<TBrands>) => {
  const isBrandExists = await BrandModel.findById(id);

  if (!isBrandExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Brand Not Found!");
  }

  const result = await BrandModel.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteBrandFromDB = async (id: string) => {
  const isBrandExists = await BrandModel.findById(id);

  if (!isBrandExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Brand Not Found!");
  }

  const result = await BrandModel.findByIdAndDelete(id);
  return result;
};

export const brandServices = {
  getAllBrandsFromDB,
  getSingleBrandFromDB,
  createBrandOnDB,
  updateBrandOnDB,
  deleteBrandFromDB,
};
