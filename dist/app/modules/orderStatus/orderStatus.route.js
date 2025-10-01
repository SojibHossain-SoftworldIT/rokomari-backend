"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatusRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const orderStatus_controller_1 = require("./orderStatus.controller");
const orderStatus_validations_1 = require("./orderStatus.validations");
const router = express_1.default.Router();
router.get("/", orderStatus_controller_1.orderStatusControllers.getAllOrderStatus);
router.get("/:id", orderStatus_controller_1.orderStatusControllers.getSingleOrderStatus);
router.get("/my-order-statuses/:customerId", orderStatus_controller_1.orderStatusControllers.getMyOrderStatuses);
// router.post(
//   "/create-order-status",
//   validateRequest(createOrderStatusZodSchema),
//   orderStatusControllers.createOrderStatus
// );
router.patch("/:id", (0, validateRequest_1.default)(orderStatus_validations_1.createOrderStatusZodSchema), orderStatus_controller_1.orderStatusControllers.updateOrderStatus);
// router.delete("/:id", orderStatusControllers.deleteOrderStatus);
exports.OrderStatusRoutes = router;
