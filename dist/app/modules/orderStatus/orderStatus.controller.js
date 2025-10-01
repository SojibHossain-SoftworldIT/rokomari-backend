"use strict";
// import httpStatus from "http-status";
// import catchAsync from "../../utils/catchAsync";
// import sendResponse from "../../utils/sendResponse";
// import { orderStatusServices } from "./orderStatus.service";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderStatusControllers = void 0;
// // 🔹 Get all OrderStatus
// const getAllOrderStatus = catchAsync(async (req, res) => {
//   const result = await orderStatusServices.getAllOrderStatusFromDB(req.query);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Order statuses retrieved successfully!",
//     data: result,
//   });
// });
// // 🔹 Get single OrderStatus
// const getSingleOrderStatus = catchAsync(async (req, res) => {
//   const id = req.params.id;
//   const result = await orderStatusServices.getSingleOrderStatusFromDB(id);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Order status retrieved successfully!",
//     data: result,
//   });
// });
// // 🔹 Create OrderStatus
// const createOrderStatus = catchAsync(async (req, res) => {
//   const orderStatusData = req.body;
//   const result = await orderStatusServices.createOrderStatusIntoDB(
//     orderStatusData
//   );
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Order status created successfully!",
//     data: result,
//   });
// });
// // 🔹 Update OrderStatus
// const updateOrderStatus = catchAsync(async (req, res) => {
//   const id = req.params.id;
//   const orderStatusData = req.body;
//   const result = await orderStatusServices.updateOrderStatusInDB(
//     id,
//     orderStatusData
//   );
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Order status updated successfully!",
//     data: result,
//   });
// });
// export const getMyOrderStatuses = catchAsync(async (req, res) => {
//   const { customerId } = req.params;
//   const result = await orderStatusServices.getMyOrderStatusesFromDB(customerId);
//   res.status(200).json({
//     success: true,
//     message: "My order statuses retrieved successfully!",
//     data: result,
//   });
// });
// // 🔹 Delete OrderStatus
// const deleteOrderStatus = catchAsync(async (req, res) => {
//   const id = req.params.id;
//   const result = await orderStatusServices.deleteOrderStatusFromDB(id);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Order status deleted successfully!",
//     data: result,
//   });
// });
// export const orderStatusControllers = {
//   getAllOrderStatus,
//   getSingleOrderStatus,
//   getMyOrderStatuses,
//   createOrderStatus,
//   updateOrderStatus,
//   deleteOrderStatus,
// };
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const orderStatus_service_1 = require("./orderStatus.service");
// 🔹 Get all Order statuses (from OrderModel)
const getAllOrderStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield orderStatus_service_1.orderStatusServices.getAllOrderStatusFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "All order statuses retrieved successfully!",
        data: result,
    });
}));
// 🔹 Get statuses for a single order
const getSingleOrderStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const result = yield orderStatus_service_1.orderStatusServices.getSingleOrderStatusFromDB(orderId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order status retrieved successfully!",
        data: result,
    });
}));
// 🔹 Update specific order status
const updateOrderStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const _a = req.body, { trackingNumber } = _a, payload = __rest(_a, ["trackingNumber"]); // trackingNumber required
    const result = yield orderStatus_service_1.orderStatusServices.updateOrderStatusInDB(orderId, trackingNumber, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order status updated successfully!",
        data: result,
    });
}));
// 🔹 Get my statuses (customer-specific)
const getMyOrderStatuses = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId } = req.params;
    const result = yield orderStatus_service_1.orderStatusServices.getMyOrderStatusesFromDB(customerId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "My order statuses retrieved successfully!",
        data: result,
    });
}));
exports.orderStatusControllers = {
    getAllOrderStatus,
    getSingleOrderStatus,
    getMyOrderStatuses,
    updateOrderStatus,
};
