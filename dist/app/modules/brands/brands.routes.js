"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_config_1 = require("../../config/multer.config");
const brands_controller_1 = require("./brands.controller");
// import upload from "../../middlewares/upload"; // ✅ your multer middleware
const router = express_1.default.Router();
router.get("/", brands_controller_1.brandsControllers.getAllBrands);
router.get("/:id", brands_controller_1.brandsControllers.getSingleBrand);
router.post("/create-brand", multer_config_1.multerUpload.fields([
    { name: "iconFile", maxCount: 1 },
    { name: "imagesFiles", maxCount: 10 },
]), brands_controller_1.brandsControllers.createBrand);
router.patch("/update-brand/:id", multer_config_1.multerUpload.fields([
    { name: "iconFile", maxCount: 1 },
    { name: "imagesFiles", maxCount: 10 },
]), brands_controller_1.brandsControllers.updateBrand);
router.delete("/delete-brand/:id", brands_controller_1.brandsControllers.deleteBrand);
exports.BrandRoutes = router;
