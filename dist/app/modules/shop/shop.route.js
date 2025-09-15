"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const shop_controller_1 = require("./shop.controller");
const shop_validations_1 = require("./shop.validations");
const multer_config_1 = require("../../config/multer.config");
const router = express_1.default.Router();
router.get("/", shop_controller_1.shopControllers.getAllShop);
router.get("/:id", shop_controller_1.shopControllers.getSingleShop);
router.post('/create-shop', multer_config_1.multerUpload.fields([
    { name: 'shopLogofile', maxCount: 1 },
    { name: 'shopCoverFile', maxCount: 1 },
]), (0, validateRequest_1.default)(shop_validations_1.createShopZodSchema), shop_controller_1.shopControllers.createShop);
exports.ShopRoutes = router;
