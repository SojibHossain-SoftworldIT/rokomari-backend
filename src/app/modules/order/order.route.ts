import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { orderControllers } from "./order.controller";
import {
  changeOrderStatusZodSchema,
  createOrderZodSchema,
} from "./order.validation";

const router = express.Router();

router.get("/", orderControllers.getAllOrder);

router.get("/order-summary", orderControllers.getOrderSummary);
router.get("/recently-sold-products", orderControllers.recentlyOrderedProducts);
router.get("/order-range-summary", orderControllers.getOrderRangeSummary);

router.get("/my-order/:id", orderControllers.getMyOrders);

router.get("/:id", orderControllers.getSingleOrder);

router.get("/track/:trackingNumber", orderControllers.getOrderByTrackingNumber);

router.post(
  "/create-order",
  validateRequest(createOrderZodSchema),
  orderControllers.createOrder
);

router.patch(
  "/change-status/:orderId",
  validateRequest(changeOrderStatusZodSchema), // optional
  orderControllers.changeOrderStatus
);

router.patch("/:id", orderControllers.updateOrder);

export const OrderRoutes = router;
