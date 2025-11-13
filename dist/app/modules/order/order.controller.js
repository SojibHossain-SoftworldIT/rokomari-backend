"use strict";
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
exports.orderControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const order_service_1 = require("./order.service");
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const getAllOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.orderServices.getAllOrdersFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Orders retrieve successfully!",
        data: result.data,
        meta: result.meta,
    });
}));
const getMyOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = req.params.id;
    const result = yield order_service_1.orderServices.getMyOrdersFromDB(customerId, req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Orders retrieved successfully!",
        data: result,
    });
}));
const recentlyOrderedProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.orderServices.recentlyOrderedProductsFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Recently ordered products retrieved successfully!",
        data: result,
    });
}));
const getSingleOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield order_service_1.orderServices.getSingleOrderFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order retrieve successfully!",
        data: result,
    });
}));
/**
 * ✅ Get Order by Tracking Number (Public Route)
 */
const getOrderByTrackingNumber = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { trackingNumber } = req.params;
    const result = yield order_service_1.orderServices.getOrderByTrackingNumberFromDB(trackingNumber);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Order retrieved successfully by tracking number!",
        data: result,
    });
}));
const getOrderSummary = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.orderServices.getOrderSummaryFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order summary retrieved successfully!",
        data: result,
    });
}));
const getOrderRangeSummary = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { start, end } = req.query;
    if (!start || !end) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, "Both 'start' and 'end' date query parameters are required!");
    }
    const result = yield order_service_1.orderServices.getOrderRangeSummaryFromDB(start, end);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order range summary retrieved successfully!",
        data: result,
    });
}));
const createOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderData = req.body;
    const result = yield order_service_1.orderServices.createOrderIntoDB(orderData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order created successfully!",
        data: result,
    });
}));
const updateOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateData = req.body;
    const result = yield order_service_1.orderServices.updateOrderInDB(id, updateData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order updated successfully!",
        data: result,
    });
}));
const changeOrderStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const { status } = req.body;
    const result = yield order_service_1.orderServices.changeOrderStatusInDB(orderId, status);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order status updated successfully!",
        data: result,
    });
}));
exports.orderControllers = {
    getAllOrder,
    getSingleOrder,
    createOrder,
    updateOrder,
    getMyOrders,
    getOrderSummary,
    recentlyOrderedProducts,
    getOrderByTrackingNumber,
    getOrderRangeSummary,
    changeOrderStatus,
};
