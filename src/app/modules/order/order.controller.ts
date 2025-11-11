import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { orderServices } from "./order.service";
import AppError from "../../errors/handleAppError";

const getAllOrder = catchAsync(async (req, res) => {
  const result = await orderServices.getAllOrdersFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders retrieve successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getMyOrders = catchAsync(async (req, res) => {
  const customerId = req.params.id;

  const result = await orderServices.getMyOrdersFromDB(customerId, req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders retrieved successfully!",
    data: result,
  });
});

const recentlyOrderedProducts = catchAsync(async (req, res) => {
  const result = await orderServices.recentlyOrderedProductsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Recently ordered products retrieved successfully!",
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await orderServices.getSingleOrderFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order retrieve successfully!",
    data: result,
  });
});

/**
 * ✅ Get Order by Tracking Number (Public Route)
 */
const getOrderByTrackingNumber = catchAsync(async (req, res) => {
  const { trackingNumber } = req.params;

  const result = await orderServices.getOrderByTrackingNumberFromDB(
    trackingNumber
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order retrieved successfully by tracking number!",
    data: result,
  });
});

const getOrderSummary = catchAsync(async (req, res) => {
  const result = await orderServices.getOrderSummaryFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order summary retrieved successfully!",
    data: result,
  });
});

const getOrderRangeSummary = catchAsync(async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Both 'start' and 'end' date query parameters are required!"
    );
  }

  const result = await orderServices.getOrderRangeSummaryFromDB(
    start as string,
    end as string
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order range summary retrieved successfully!",
    data: result,
  });
});

const createOrder = catchAsync(async (req, res) => {
  const orderData = req.body;
  const result = await orderServices.createOrderIntoDB(orderData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order created successfully!",
    data: result,
  });
});

const updateOrder = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  const result = await orderServices.updateOrderInDB(id, updateData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order updated successfully!",
    data: result,
  });
});

const changeOrderStatus = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const result = await orderServices.changeOrderStatusInDB(orderId, status);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order status updated successfully!",
    data: result,
  });
});

export const orderControllers = {
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
