import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/handleAppError";
import httpStatus from "http-status";
import { OrderModel } from "./order.model";
import { OrderSearchableFields } from "./order.consts";
import { TOrder } from "./order.interface";
import { nanoid } from "nanoid";

const getAllOrdersFromDB = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(OrderModel.find(), query)
    .search(OrderSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.modelQuery;

  return result;
};

const getMyOrdersFromDB = async (
  customerId: string,
  query: Record<string, unknown>
) => {
  const orderQuery = new QueryBuilder(
    OrderModel.find({ "orderInfo.customerInfo": customerId }),
    query
  )
    .search(OrderSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.modelQuery;

  return result;
};

const getSingleOrderFromDB = async (id: string) => {
  const result = OrderModel.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Order does not exists!");
  }

  return result;
};

const createOrderIntoDB = async (payload: TOrder) => {
  if (payload) {
    payload.orderInfo.forEach((order) => (order.trackingNumber = nanoid()));
  }
  const result = await OrderModel.create(payload);

  return result;
};

export const orderServices = {
  getAllOrdersFromDB,
  getSingleOrderFromDB,
  createOrderIntoDB,
  getMyOrdersFromDB,
};
