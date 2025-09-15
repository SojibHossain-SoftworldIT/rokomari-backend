import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { orderControllers } from "./order.controller";
import { createOrderZodSchema } from "./order.validation";

const router = express.Router();

router.get("/", orderControllers.getAllOrder);

router.get("/my-order/:id", orderControllers.getMyOrders);

router.get("/:id", orderControllers.getSingleOrder);

router.post(
  "/create-order",
  validateRequest(createOrderZodSchema),
  orderControllers.createOrder
);

export const OrderRoutes = router;
