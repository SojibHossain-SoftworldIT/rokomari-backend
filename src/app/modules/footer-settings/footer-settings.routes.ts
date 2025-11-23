import express from "express";
import { multerUpload } from "../../config/multer.config";
import validateRequest from "../../middlewares/validateRequest";
import { footerSettingsControllers } from "./footer-settings.controller";
import { footerSettingsValidations } from "./footer-settings.validations";

const router = express.Router();

// Public routes
router.get("/active-menus", footerSettingsControllers.getActiveFooterMenus);
router.get("/page/:slug", footerSettingsControllers.getPageContentBySlug);
router.get("/with-dynamic-status", footerSettingsControllers.getFooterWithDynamicPageStatus);
router.get("/", footerSettingsControllers.getFooterSettings);

// Admin routes
router.get("/all", footerSettingsControllers.getAllFooterSettings);
router.get("/available-pages", footerSettingsControllers.getAvailableDynamicPages);
router.get("/:id", footerSettingsControllers.getFooterSettingsById);
router.post(
  "/",
  validateRequest(footerSettingsValidations.createFooterSettingsValidation),
  footerSettingsControllers.createFooterSettings
);
router.patch(
  "/:id",
  multerUpload.fields([{ name: "heroImage", maxCount: 1 }]),
  validateRequest(footerSettingsValidations.updateFooterSettingsValidation),
  footerSettingsControllers.updateFooterSettings
);
router.delete("/:id", footerSettingsControllers.deleteFooterSettings);


router.post(
  "/create-submenu-with-page",
  multerUpload.fields([{ name: "heroImage", maxCount: 1 }]),
  footerSettingsControllers.createSubmenuWithDynamicPage
);
router.delete("/clear-all", footerSettingsControllers.clearAllFooterSettings);

export const footerSettingsRoutes = router;