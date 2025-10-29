import httpStatus from "http-status";
import { nanoid } from "nanoid";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/handleAppError";
import { OrderSearchableFields } from "./order.consts";
import { TOrder } from "./order.interface";
import { OrderModel } from "./order.model";

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

/**
 * ✅ Get Order by Tracking Number (Public - no authentication required)
 */
const getOrderByTrackingNumberFromDB = async (trackingNumber: string) => {
  // Find the order by nested field `orderInfo.trackingNumber`
  const result = await OrderModel.findOne({
    "orderInfo.trackingNumber": trackingNumber,
  })
    .populate({
      path: "orderInfo.productInfo",
      select:
        "description.name productInfo.price productInfo.salePrice featuredImg",
    })
    .lean(); // ✅ use .lean() for plain JS object (no Mongoose document overhead)

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Order not found with this tracking number!"
    );
  }

  // ✅ Find the specific orderInfo that matches this tracking number
  const matchedOrderInfo = result.orderInfo.find(
    (info) => info.trackingNumber === trackingNumber
  );

  if (!matchedOrderInfo) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Tracking number not found in this order!"
    );
  }

  // ✅ Final structured response
  const orderWithTracking = {
    _id: result._id,
    orderInfo: [matchedOrderInfo],
    customerInfo: result.customerInfo,
    paymentInfo: result.paymentInfo,
    totalAmount: result.totalAmount,
  };

  return orderWithTracking;
};

export const OrderServices = {
  getOrderByTrackingNumberFromDB,
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
  createOrderIntoDB,
  updateOrderInDB,
  getOrderSummaryFromDB,
  getOrderByTrackingNumberFromDB,
  getMyOrdersFromDB,
};
