"use strict";
// import httpStatus from "http-status";
// import QueryBuilder from "../../builder/QueryBuilder";
// import AppError from "../../errors/handleAppError";
// import { OrderModel } from "../order/order.model";
// import { OrderStatusSearchableFields } from "./orderStatus.const";
// import { TOrderStatus } from "./orderStatus.interface";
// import { OrderStatus } from "./orderStatus.model";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderStatusServices = void 0;
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
const http_status_1 = __importDefault(require("http-status"));
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const order_model_1 = require("../order/order.model");
const getAllOrderStatusFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // Find all orders and return status info
    const orders = yield order_model_1.OrderModel.find().select("orderInfo _id createdAt totalAmount paymentInfo");
    const allStatuses = orders.flatMap((order) => order.orderInfo.map((info) => ({
        orderId: order._id,
        orderBy: info.orderBy,
        trackingNumber: info.trackingNumber,
        status: info.status,
        isCancelled: info.isCancelled,
        createdAt: order.get("createdAt"),
        totalAmount: order.totalAmount,
        paymentInfo: order.paymentInfo,
    })));
    return allStatuses;
});
const getSingleOrderStatusFromDB = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.OrderModel.findById(orderId).select("orderInfo _id createdAt totalAmount paymentInfo");
    if (!order) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Order does not exist!");
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
});
const updateOrderStatusInDB = (orderId, trackingNumber, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.OrderModel.findOneAndUpdate({ _id: orderId, "orderInfo.trackingNumber": trackingNumber }, {
        $set: {
            "orderInfo.$.status": payload.status,
            "orderInfo.$.isCancelled": payload.isCancelled,
        },
    }, { new: true }).select("orderInfo _id createdAt totalAmount paymentInfo");
    if (!order) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Order status not found!");
    }
    return order;
});
const getMyOrderStatusesFromDB = (customerId) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.OrderModel.find({
        "orderInfo.orderBy": customerId,
    }).select("orderInfo _id createdAt totalAmount paymentInfo");
    return orders.flatMap((order) => order.orderInfo.map((info) => ({
        orderId: order._id,
        orderBy: info.orderBy,
        trackingNumber: info.trackingNumber,
        status: info.status,
        isCancelled: info.isCancelled,
        createdAt: order.get("createdAt"),
        totalAmount: order.totalAmount,
        paymentInfo: order.paymentInfo,
    })));
});
exports.orderStatusServices = {
    getAllOrderStatusFromDB,
    getSingleOrderStatusFromDB,
    updateOrderStatusInDB,
    getMyOrderStatusesFromDB,
};
