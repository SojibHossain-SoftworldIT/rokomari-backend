// import httpStatus from "http-status";
// import QueryBuilder from "../../builder/QueryBuilder";
// import AppError from "../../errors/handleAppError";
// import { OrderModel } from "../order/order.model";
// import { OrderStatusSearchableFields } from "./orderStatus.const";
// import { TOrderStatus } from "./orderStatus.interface";
// import { OrderStatus } from "./orderStatus.model";

// const getAllOrderStatusFromDB = async (query: Record<string, unknown>) => {
//   const orderStatusQuery = new QueryBuilder(OrderStatus.find(), query)
//     .search(OrderStatusSearchableFields)
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const result = await orderStatusQuery.modelQuery;

//   return result;
// };

// const getSingleOrderStatusFromDB = async (id: string) => {
//   const result = await OrderStatus.findById(id);

//   if (!result) {
//     throw new AppError(httpStatus.NOT_FOUND, "OrderStatus does not exist!");
//   }

//   return result;
// };

// const createOrderStatusIntoDB = async (payload: TOrderStatus) => {
//   const result = await OrderStatus.create(payload);

//   return result;
// };

// const updateOrderStatusInDB = async (
//   id: string,
//   payload: Partial<TOrderStatus>
// ) => {
//   const result = await OrderStatus.findByIdAndUpdate(id, payload, {
//     new: true,
//     runValidators: true,
//   });

//   if (!result) {
//     throw new AppError(httpStatus.NOT_FOUND, "OrderStatus does not exist!");
//   }

//   return result;
// };

// const getMyOrderStatusesFromDB = async (customerId: string) => {
//   // Find orders where this user is the buyer
//   const orders = await OrderModel.find({
//     "orderInfo.orderBy": customerId,
//   }).select("orderInfo _id createdAt totalAmount paymentInfo");

//   // Map only status + tracking + orderId for frontend
//   const myStatuses = orders.flatMap((order) =>
//     order.orderInfo.map((info) => ({
//       orderId: order._id,
//       trackingNumber: info.trackingNumber,
//       status: info.status,
//       isCancelled: info.isCancelled,
//       createdAt: order.get("createdAt"),
//       totalAmount: order.totalAmount,
//       paymentInfo: order.paymentInfo,
//     }))
//   );

//   return myStatuses;
// };

// // 🔹 Delete OrderStatus
// const deleteOrderStatusFromDB = async (id: string) => {
//   const result = await OrderStatus.findByIdAndDelete(id);

//   if (!result) {
//     throw new AppError(httpStatus.NOT_FOUND, "OrderStatus does not exist!");
//   }

//   return result;
// };

// export const orderStatusServices = {
//   getAllOrderStatusFromDB,
//   getSingleOrderStatusFromDB,
//   createOrderStatusIntoDB,
//   updateOrderStatusInDB,
//   getMyOrderStatusesFromDB,
//   deleteOrderStatusFromDB,
// };

import httpStatus from "http-status";
import AppError from "../../errors/handleAppError";
import { OrderModel } from "../order/order.model";

const getAllOrderStatusFromDB = async () => {
  // Find all orders and return status info
  const orders = await OrderModel.find().select(
    "orderInfo _id createdAt totalAmount paymentInfo"
  );

  const allStatuses = orders.flatMap((order) =>
    order.orderInfo.map((info) => ({
      orderId: order._id,
      orderBy: info.orderBy,
      trackingNumber: info.trackingNumber,
      status: info.status,
      isCancelled: info.isCancelled,
      createdAt: order.get("createdAt"),
      totalAmount: order.totalAmount,
      paymentInfo: order.paymentInfo,
    }))
  );

  return allStatuses;
};

const getSingleOrderStatusFromDB = async (orderId: string) => {
  const order = await OrderModel.findById(orderId).select(
    "orderInfo _id createdAt totalAmount paymentInfo"
  );

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order does not exist!");
  }

  return order.orderInfo.map((info) => ({
    orderId: order._id,
    orderBy: info.orderBy,
    trackingNumber: info.trackingNumber,
    status: info.status,
    isCancelled: info.isCancelled,
    createdAt: order.get("createdAt"),
    totalAmount: order.totalAmount,
    paymentInfo: order.paymentInfo,
  }));
};

const updateOrderStatusInDB = async (
  orderId: string,
  trackingNumber: string,
  payload: { status?: string; isCancelled?: boolean }
) => {
  const order = await OrderModel.findOneAndUpdate(
    { _id: orderId, "orderInfo.trackingNumber": trackingNumber },
    {
      $set: {
        "orderInfo.$.status": payload.status,
        "orderInfo.$.isCancelled": payload.isCancelled,
      },
    },
    { new: true }
  ).select("orderInfo _id createdAt totalAmount paymentInfo");

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order status not found!");
  }

  return order;
};

const getMyOrderStatusesFromDB = async (customerId: string) => {
  const orders = await OrderModel.find({
    "orderInfo.orderBy": customerId,
  }).select("orderInfo _id createdAt totalAmount paymentInfo");

  return orders.flatMap((order) =>
    order.orderInfo.map((info) => ({
      orderId: order._id,
      orderBy: info.orderBy,
      trackingNumber: info.trackingNumber,
      status: info.status,
      isCancelled: info.isCancelled,
      createdAt: order.get("createdAt"),
      totalAmount: order.totalAmount,
      paymentInfo: order.paymentInfo,
    }))
  );
};

export const orderStatusServices = {
  getAllOrderStatusFromDB,
  getSingleOrderStatusFromDB,
  updateOrderStatusInDB,
  getMyOrderStatusesFromDB,
};
