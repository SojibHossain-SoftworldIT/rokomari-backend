import httpStatus from "http-status";
import { nanoid } from "nanoid";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/handleAppError";
import { ProductModel } from "../product/product.model";
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

const recentlyOrderedProductsFromDB = async () => {
  // 🔹 Step 1: Aggregate to get recent product IDs from orders
  const recentOrders = await OrderModel.aggregate([
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

  if (!productIds.length) return [];

  // 🔹 Step 3: Fetch products with full population
  const products = await ProductModel.find({ _id: { $in: productIds } })
    .populate({
      path: "categoryAndTags.categories",
      select:
        "mainCategory name slug details icon image bannerImg subCategories",
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
  const sortedProducts = productIds.map((id) =>
    products.find((p) => p._id.toString() === id.toString())
  );

  return sortedProducts.filter(Boolean);
};

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
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    if (payload) {
      payload.orderInfo.forEach((order) => (order.trackingNumber = nanoid()));
    }
    
    // Create the order
    const result = await OrderModel.create([payload], { session });
    
    // Update soldCount for each product in the order
    for (const orderInfo of payload.orderInfo) {
      await ProductModel.findByIdAndUpdate(
        orderInfo.productInfo,
        { $inc: { soldCount: orderInfo.quantity } },
        { session }
      );
    }
    
    await session.commitTransaction();
    return result[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
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
  recentlyOrderedProductsFromDB,
  getMyOrdersFromDB,
};
