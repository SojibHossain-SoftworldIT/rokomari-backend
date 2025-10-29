import httpStatus from "http-status";
import { nanoid } from "nanoid";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/handleAppError";
import { OrderSearchableFields } from "./order.consts";
import { TOrder } from "./order.interface";
import { OrderModel } from "./order.model";
import { ProductModel } from "../product/product.model";

const getAllOrdersFromDB = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(OrderModel.find(), query)
    .search(OrderSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  // ✅ Execute main query for product data
  const data = await orderQuery.modelQuery;

  // ✅ Use built-in countTotal() from QueryBuilder
  const meta = await orderQuery.countTotal();

  return {
    meta,
    data,
  };
};

//get my orders
const getMyOrdersFromDB = async (
  customerId: string,
  query: Record<string, unknown>
) => {
  const orderQuery = new QueryBuilder(
    OrderModel.find({ "orderInfo.orderBy": customerId }), // ✅ fixed
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

// Get order by tracking number
const getOrderByTrxFromDB = async (trackingNumber: string) => {
  if (!trackingNumber) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tracking number is required!");
  }

  // Force model registration (add this line)
  ProductModel;

  const result = await OrderModel.findOne({
    "orderInfo.trackingNumber": trackingNumber,
  })
    .populate("orderInfo.productInfo", "description featuredImg productInfo")
    .populate("orderInfo.orderBy", "name email phone")
    .lean();

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "No order found for this tracking number!"
    );
  }

  return result;
};

// Get order summary (pending/completed counts and totals)
const getOrderSummaryFromDB = async () => {
  // Aggregate orders data
  const orders = await OrderModel.find();

  // initialize counters
  let totalOrders = orders.length;
  let totalPendingOrders = 0;
  let totalCompletedOrders = 0;
  let totalPendingAmount = 0;
  let totalCompletedAmount = 0;

  // loop through all orders
  orders.forEach((order) => {
    if (Array.isArray(order.orderInfo) && order.orderInfo.length > 0) {
      const status = order.orderInfo[0].status;
      const total = order.totalAmount || 0;

      if (status === "pending") {
        totalPendingOrders++;
        totalPendingAmount += total;
      } else if (status === "completed") {
        totalCompletedOrders++;
        totalCompletedAmount += total;
      }
    }
  });

  return {
    totalOrders,
    totalPendingOrders,
    totalCompletedOrders,
    totalPendingAmount,
    totalCompletedAmount,
  };
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

const updateOrderInDB = async (id: string, payload: Partial<TOrder>) => {
  const isExist = await OrderModel.findById(id);

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Order does not exists!");
  }

  const result = await OrderModel.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const orderServices = {
  getAllOrdersFromDB,
  getSingleOrderFromDB,
  getOrderByTrxFromDB,
  createOrderIntoDB,
  updateOrderInDB,
  getOrderSummaryFromDB,
  getMyOrdersFromDB,
};
