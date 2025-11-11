"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_config_1 = require("../../config/multer.config");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const product_controller_1 = require("./product.controller");
const product_validations_1 = require("./product.validations");
const router = express_1.default.Router();
router.get("/", product_controller_1.productControllers.getAllProduct);
router.get("/search", product_controller_1.productControllers.searchProducts);
router.get("/:id", product_controller_1.productControllers.getSingleProduct);
router.get("/products/by", product_controller_1.productControllers.getProductsByCategoryandTag);
router.get("/by-author/:authorId", product_controller_1.productControllers.getProductsByAuthor);
router.post("/create-product", multer_config_1.multerUpload.fields([
    { name: "galleryImagesFiles", maxCount: 5 },
    { name: "featuredImgFile", maxCount: 1 },
    { name: "previewImgFile", maxCount: 20 },
    // ...Array.from({ length: 10 }).map((_, i) => ({
    //   name: `authorImage_${i}`,
    //   maxCount: 1,
    // })),
]), (0, validateRequest_1.default)(product_validations_1.createProductZodSchema), product_controller_1.productControllers.createProduct);
router.patch("/update-product/:id", multer_config_1.multerUpload.fields([
    { name: "galleryImagesFiles", maxCount: 5 },
    { name: "featuredImgFile", maxCount: 1 },
    { name: "previewImgFile", maxCount: 20 },
    // ...Array.from({ length: 10 }).map((_, i) => ({
    //   name: `authorImage_${i}`,
    //   maxCount: 1,
    // })),
]), (0, validateRequest_1.default)(product_validations_1.updateProductZodSchema), product_controller_1.productControllers.updateProduct);
router.delete("/delete-product/:id", product_controller_1.productControllers.deleteSingleProduct);
exports.ProductRoutes = router;
