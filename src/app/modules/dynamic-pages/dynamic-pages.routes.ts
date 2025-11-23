import express from "express";
import { multerUpload } from "../../config/multer.config";
import { dynamicPagesControllers } from "./dynamic-pages.controller";

const router = express.Router();

// Public routes
router.get("/page/:slug", dynamicPagesControllers.getDynamicPageBySlug);

// Admin routes
router.get("/", dynamicPagesControllers.getAllDynamicPages);
router.get("/:id", dynamicPagesControllers.getDynamicPageById);
router.post(
  "/",
  multerUpload.fields([{ name: "heroImage", maxCount: 1 }]),
  dynamicPagesControllers.createDynamicPage
);
router.patch(
  "/:id",
  multerUpload.fields([{ name: "heroImage", maxCount: 1 }]),
  dynamicPagesControllers.updateDynamicPage
);
router.delete("/:id", dynamicPagesControllers.deleteDynamicPage);

export const dynamicPagesRoutes = router;