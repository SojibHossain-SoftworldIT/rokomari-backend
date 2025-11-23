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
exports.orderServices = exports.OrderServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const nanoid_1 = require("nanoid");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const product_model_1 = require("../product/product.model");
const order_consts_1 = require("./order.consts");
const order_model_1 = require("./order.model");
const getAllOrdersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const orderQuery = new QueryBuilder_1.default(order_model_1.OrderModel.find(), query)
        .search(order_consts_1.OrderSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    // ✅ Execute main query for product data
    const data = yield orderQuery.modelQuery;
    // ✅ Use built-in countTotal() from QueryBuilder
    const meta = yield orderQuery.countTotal();
    return {
        meta,
        data,
    };
});
// const recentlyOrderedProductsFromDB = async () => {
//   // Aggregate orders to find recently ordered products
//   const recentOrders = await OrderModel.aggregate([
//     { $unwind: "$orderInfo" },
//     { $sort: { "orderInfo.orderDate": -1 } },
//     {
//       $group: {
//         _id: "$orderInfo.productInfo",
//         lastOrderedDate: { $first: "$orderInfo.orderDate" },
//       },
//     },
//     { $sort: { lastOrderedDate: -1 } },
//     { $limit: 12 }, // Get top 12 recently ordered products
//   ]);
//   // Extract product IDs
//   const productIds = recentOrders.map((order) => order._id);
//   return productIds;
// };
//get my orders
const recentlyOrderedProductsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // 🔹 Step 1: Aggregate to get recent product IDs from orders
    const recentOrders = yield order_model_1.OrderModel.aggregate([
        { $unwind: "$orderInfo" },
        { $sort: { "orderInfo.orderDate": -1 } },
        {
            $group: {
                _id: "$orderInfo.productInfo", // store productId
                lastOrderedDate: { $first: "$orderInfo.orderDate" },
            },
        },
        { $sort: { lastOrderedDate: -1 } },
        { $limit: 12 },
    ]);
    // 🔹 Step 2: Extract product IDs
    const productIds = recentOrders.map((order) => order._id);
    if (!productIds.length)
        return [];
    // 🔹 Step 3: Fetch products with full population
    const products = yield product_model_1.ProductModel.find({ _id: { $in: productIds } })
        .populate({
        path: "categoryAndTags.categories",
        select: "mainCategory name slug details icon image bannerImg subCategories",
    })
        .populate({
        path: "categoryAndTags.tags",
        select: "name slug details icon image",
    })
        .populate({
        path: "productInfo.brand",
        select: "name logo slug",
    })
        .populate({
        path: "bookInfo.specification.authors",
        select: "name image description",
    })
        .lean()
        .exec();
    // 🔹 Step 4: Sort products in the same order as recentOrders
    const sortedProducts = productIds.map((id) => products.find((p) => p._id.toString() === id.toString()));
    return sortedProducts.filter(Boolean);
});
const getMyOrdersFromDB = (customerId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const orderQuery = new QueryBuilder_1.default(order_model_1.OrderModel.find({ "orderInfo.orderBy": customerId }), // ✅ fixed
    query)
        .search(order_consts_1.OrderSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield orderQuery.modelQuery;
    return result;
});
/**
 * ✅ Get Order by Tracking Number (Public - no authentication required)
 */
const getOrderByTrackingNumberFromDB = (trackingNumber) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the order by nested field `orderInfo.trackingNumber`
    const result = yield order_model_1.OrderModel.findOne({
        "orderInfo.trackingNumber": trackingNumber,
    })
        .populate({
        path: "orderInfo.productInfo",
        select: "description.name productInfo.price productInfo.salePrice featuredImg",
    })
        .lean(); // ✅ use .lean() for plain JS object (no Mongoose document overhead)
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Order not found with this tracking number!");
    }
    // ✅ Find the specific orderInfo that matches this tracking number
    const matchedOrderInfo = result.orderInfo.find((info) => info.trackingNumber === trackingNumber);
    if (!matchedOrderInfo) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Tracking number not found in this order!");
    }
    // ✅ Final structured response
    const orderWithTracking = {
        _id: result._id,
        orderInfo: [matchedOrderInfo],
        customerInfo: result.customerInfo,
        paymentInfo: result.paymentInfo,
        totalAmount: result.totalAmount,
        createdAt: result.createdAt,
    };
    return orderWithTracking;
});
exports.OrderServices = {
    getOrderByTrackingNumberFromDB,
};
// Get order summary (pending/completed counts and totals)
const getOrderSummaryFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // Aggregate orders data
    const orders = yield order_model_1.OrderModel.find();
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
            }
            else if (status === "completed") {
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
});
const getOrderRangeSummaryFromDB = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    // Parse dates and set time range
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include full end day
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid date format!");
    }
    // Fetch orders within date range
    const orders = yield order_model_1.OrderModel.find({
        createdAt: { $gte: start, $lte: end },
    }).lean();
    let totalOrders = orders.length;
    let totalPendingOrders = 0;
    let totalCompletedOrders = 0;
    let totalPendingAmount = 0;
    let totalCompletedAmount = 0;
    orders.forEach((order) => {
        if (Array.isArray(order.orderInfo) && order.orderInfo.length > 0) {
            // Assuming first orderInfo status represents the whole order
            const status = order.orderInfo[0].status;
            const total = order.totalAmount || 0;
            if (status === "pending") {
                totalPendingOrders++;
                totalPendingAmount += total;
            }
            else if (status === "completed") {
                totalCompletedOrders++;
                totalCompletedAmount += total;
            }
        }
    });
    return {
        totalOrders,
        totalPendingOrders,
        totalCompletedOrders,
        totalPendingAmount: Number(totalPendingAmount.toFixed(2)),
        totalCompletedAmount: Number(totalCompletedAmount.toFixed(2)),
        dateRange: {
            start: start.toISOString().split("T")[0],
            end: end.toISOString().split("T")[0],
        },
    };
});
const getSingleOrderFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = order_model_1.OrderModel.findById(id);
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Order does not exists!");
    }
    return result;
});
const createOrderIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload) {
        payload.orderInfo.forEach((order) => (order.trackingNumber = (0, nanoid_1.nanoid)()));
    }
    const result = yield order_model_1.OrderModel.create(payload);
    return result;
});
const updateOrderInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield order_model_1.OrderModel.findById(id);
    if (!isExist) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Order does not exists!");
    }
    const result = yield order_model_1.OrderModel.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const changeOrderStatusInDB = (orderId, newStatus) => __awaiter(void 0, void 0, void 0, function* () {
    // Valid status validation
    const validStatuses = [
        "pending",
        "processing",
        "at-local-facility",
        "out-for-delivery",
        "cancelled",
        "completed",
    ];
    if (!validStatuses.includes(newStatus)) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid status value!");
    }
    // Update all orderInfo.status in the array
    const result = yield order_model_1.OrderModel.findByIdAndUpdate(orderId, {
        $set: {
            "orderInfo.$[].status": newStatus, // Update all array elements
        },
    }, { new: true, runValidators: true }).lean();
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Order not found!");
    }
    return result;
});
exports.orderServices = {
    getAllOrdersFromDB,
    getSingleOrderFromDB,
    createOrderIntoDB,
    updateOrderInDB,
    getOrderSummaryFromDB,
    getOrderByTrackingNumberFromDB,
    recentlyOrderedProductsFromDB,
    getMyOrdersFromDB,
    getOrderRangeSummaryFromDB,
    changeOrderStatusInDB,
};
