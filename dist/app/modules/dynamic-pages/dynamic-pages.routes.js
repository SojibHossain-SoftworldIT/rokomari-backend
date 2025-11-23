"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicPagesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_config_1 = require("../../config/multer.config");
const dynamic_pages_controller_1 = require("./dynamic-pages.controller");
const router = express_1.default.Router();
// Public routes
router.get("/page/:slug", dynamic_pages_controller_1.dynamicPagesControllers.getDynamicPageBySlug);
// Admin routes
router.get("/", dynamic_pages_controller_1.dynamicPagesControllers.getAllDynamicPages);
router.get("/:id", dynamic_pages_controller_1.dynamicPagesControllers.getDynamicPageById);
router.post("/", multer_config_1.multerUpload.fields([{ name: "heroImage", maxCount: 1 }]), dynamic_pages_controller_1.dynamicPagesControllers.createDynamicPage);
router.patch("/:id", multer_config_1.multerUpload.fields([{ name: "heroImage", maxCount: 1 }]), dynamic_pages_controller_1.dynamicPagesControllers.updateDynamicPage);
router.delete("/:id", dynamic_pages_controller_1.dynamicPagesControllers.deleteDynamicPage);
exports.dynamicPagesRoutes = router;
