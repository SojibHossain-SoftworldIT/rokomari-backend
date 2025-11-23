"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const order_controller_1 = require("./order.controller");
const order_validation_1 = require("./order.validation");
const router = express_1.default.Router();
router.get("/", order_controller_1.orderControllers.getAllOrder);
router.get("/order-summary", order_controller_1.orderControllers.getOrderSummary);
router.get("/recently-sold-products", order_controller_1.orderControllers.recentlyOrderedProducts);
router.get("/order-range-summary", order_controller_1.orderControllers.getOrderRangeSummary);
router.get("/my-order/:id", order_controller_1.orderControllers.getMyOrders);
router.get("/:id", order_controller_1.orderControllers.getSingleOrder);
router.get("/track/:trackingNumber", order_controller_1.orderControllers.getOrderByTrackingNumber);
router.post("/create-order", (0, validateRequest_1.default)(order_validation_1.createOrderZodSchema), order_controller_1.orderControllers.createOrder);
router.patch("/change-status/:orderId", (0, validateRequest_1.default)(order_validation_1.changeOrderStatusZodSchema), // optional
order_controller_1.orderControllers.changeOrderStatus);
router.patch("/:id", order_controller_1.orderControllers.updateOrder);
exports.OrderRoutes = router;
