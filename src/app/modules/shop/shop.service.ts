import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/handleAppError";
import httpStatus from "http-status";
import { ShopModel } from "./shop.model";
import { ShopSearchableFields } from "./shop.const";
import { TShop } from "./shop.interface";
import { VendorModel } from "../vendor/vendor.model";

const getAllShopsFromDB = async (query: Record<string, unknown>) => {
  const shopQuery = new QueryBuilder(ShopModel.find(), query)
    .search(ShopSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await shopQuery.modelQuery
    .populate("vendorId")
    .populate("staffs")
    .populate("products")
    .populate("orders")
    .populate("transactions")
    .populate("withdrawals")
    .populate("attributes")
    .populate("coupons");

  return result;
};

const getSingleShopFromDB = async (id: string) => {
  const result = await ShopModel.findById(id)
    .populate("vendorId")
    .populate("staffs")
    .populate("products")
    .populate("orders")
    .populate("transactions")
    .populate("withdrawals")
    .populate("attributes")
    .populate("coupons");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Shop does not exists!");
  }

  return result;
};

const createShopIntoDB = async (payload: TShop) => {
  const isVendorExists = await VendorModel.findById(payload?.vendorId);

  if (!isVendorExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User isn't a valid vendor!");
  }
  const result = await ShopModel.create(payload);
  return result;
};

export const shopServices = {
  getAllShopsFromDB,
  getSingleShopFromDB,
  createShopIntoDB,
};
