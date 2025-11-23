"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.footerSettingsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_config_1 = require("../../config/multer.config");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const footer_settings_controller_1 = require("./footer-settings.controller");
const footer_settings_validations_1 = require("./footer-settings.validations");
const router = express_1.default.Router();
// Public routes
router.get("/active-menus", footer_settings_controller_1.footerSettingsControllers.getActiveFooterMenus);
router.get("/page/:slug", footer_settings_controller_1.footerSettingsControllers.getPageContentBySlug);
router.get("/with-dynamic-status", footer_settings_controller_1.footerSettingsControllers.getFooterWithDynamicPageStatus);
router.get("/", footer_settings_controller_1.footerSettingsControllers.getFooterSettings);
// Admin routes
router.get("/all", footer_settings_controller_1.footerSettingsControllers.getAllFooterSettings);
router.get("/available-pages", footer_settings_controller_1.footerSettingsControllers.getAvailableDynamicPages);
router.get("/:id", footer_settings_controller_1.footerSettingsControllers.getFooterSettingsById);
router.post("/", (0, validateRequest_1.default)(footer_settings_validations_1.footerSettingsValidations.createFooterSettingsValidation), footer_settings_controller_1.footerSettingsControllers.createFooterSettings);
router.patch("/:id", multer_config_1.multerUpload.fields([{ name: "heroImage", maxCount: 1 }]), (0, validateRequest_1.default)(footer_settings_validations_1.footerSettingsValidations.updateFooterSettingsValidation), footer_settings_controller_1.footerSettingsControllers.updateFooterSettings);
router.delete("/:id", footer_settings_controller_1.footerSettingsControllers.deleteFooterSettings);
router.post("/create-submenu-with-page", multer_config_1.multerUpload.fields([{ name: "heroImage", maxCount: 1 }]), footer_settings_controller_1.footerSettingsControllers.createSubmenuWithDynamicPage);
router.delete("/clear-all", footer_settings_controller_1.footerSettingsControllers.clearAllFooterSettings);
exports.footerSettingsRoutes = router;
