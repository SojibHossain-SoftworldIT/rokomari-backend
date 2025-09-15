import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/handleAppError";
import httpStatus from "http-status";
import { AttributesModel } from "./attributes.model";
import { AttributeSearchableFields } from "./attributes.consts";
import { TAttributes } from "./attributes.interface";

const getAllAttributesFromDB = async (query: Record<string, unknown>) => {
  const attributeQuery = new QueryBuilder(AttributesModel.find(), query)
    .search(AttributeSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await attributeQuery.modelQuery;

  return result;
};

const getSingleAttributeFromDB = async (id: string) => {
  const result = AttributesModel.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Attribute does not exists!");
  }

  return result;
};

const createAttributeIntoDB = async (payload: TAttributes) => {
  const isAttributeExists = await AttributesModel.findOne({
    name: payload?.name,
  });

  if (isAttributeExists) {
    throw new AppError(httpStatus.CONFLICT, "Attribute already exists!");
  }

  payload.slug = payload?.name.split(" ").join("-");

  const result = await AttributesModel.create(payload);

  return result;
};

export const attributeServices = {
  getAllAttributesFromDB,
  getSingleAttributeFromDB,
  createAttributeIntoDB,
};
