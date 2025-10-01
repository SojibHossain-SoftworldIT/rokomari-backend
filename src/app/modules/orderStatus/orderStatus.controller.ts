// import httpStatus from "http-status";
// import catchAsync from "../../utils/catchAsync";
// import sendResponse from "../../utils/sendResponse";
// import { orderStatusServices } from "./orderStatus.service";

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

import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { orderStatusServices } from "./orderStatus.service";

// 🔹 Get all Order statuses (from OrderModel)
const getAllOrderStatus = catchAsync(async (req, res) => {
  const result = await orderStatusServices.getAllOrderStatusFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All order statuses retrieved successfully!",
    data: result,
  });
});

// 🔹 Get statuses for a single order
const getSingleOrderStatus = catchAsync(async (req, res) => {
  const orderId = req.params.id;
  const result = await orderStatusServices.getSingleOrderStatusFromDB(orderId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order status retrieved successfully!",
    data: result,
  });
});

// 🔹 Update specific order status
const updateOrderStatus = catchAsync(async (req, res) => {
  const orderId = req.params.id;
  const { trackingNumber, ...payload } = req.body; // trackingNumber required

  const result = await orderStatusServices.updateOrderStatusInDB(
    orderId,
    trackingNumber,
    payload
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order status updated successfully!",
    data: result,
  });
});

// 🔹 Get my statuses (customer-specific)
const getMyOrderStatuses = catchAsync(async (req, res) => {
  const { customerId } = req.params;

  const result = await orderStatusServices.getMyOrderStatusesFromDB(customerId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My order statuses retrieved successfully!",
    data: result,
  });
});

export const orderStatusControllers = {
  getAllOrderStatus,
  getSingleOrderStatus,
  getMyOrderStatuses,
  updateOrderStatus,
};
