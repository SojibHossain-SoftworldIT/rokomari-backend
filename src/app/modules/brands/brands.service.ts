import AppError from "../../errors/handleAppError";
import { TBrands } from "./brands.interface";
import { BrandModel } from "./brands.model";
import httpStatus from "http-status";

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

export const brandServices = {
  getAllBrandsFromDB,
  getSingleBrandFromDB,
  createBrandOnDB,
};
