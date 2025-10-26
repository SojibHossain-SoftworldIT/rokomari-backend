import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { orderServices } from "./order.service";

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

const getOrderSummary = catchAsync(async (req, res) => {
  const result = await orderServices.getOrderSummaryFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order summary retrieved successfully!",
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

export const orderControllers = {
  getAllOrder,
  getSingleOrder,
  createOrder,
  updateOrder,
  getMyOrders,
  getOrderSummary,
};
