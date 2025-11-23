import express from "express";
import { multerUpload } from "../../config/multer.config";
import validateRequest from "../../middlewares/validateRequest";
import { categoryControllers } from "./category.controller";
import { createCategoryZodSchema } from "./category.validations";

const router = express.Router();

router.get("/", categoryControllers.getAllCategory);

router.get("/featured-categories", categoryControllers.getFeauturedCategories);

router.get("/:id", categoryControllers.getSingleCategory);

router.post(
  "/create-category",
  multerUpload.fields([
    { name: "imageFile", maxCount: 1 },
    { name: "bannerImgFile", maxCount: 1 },
    { name: "iconFile", maxCount: 1 },
  ]),
  validateRequest(createCategoryZodSchema),
  categoryControllers.createCategory
);

router.patch(
  "/update-category/:id",
  multerUpload.fields([
    { name: "imageFile", maxCount: 1 },
    { name: "bannerImgFile", maxCount: 1 },
    { name: "iconFile", maxCount: 1 },
  ]),
  categoryControllers.updateCategory
);

router.delete("/delete-category/:id", categoryControllers.deleteCategory);

export const CategoryRoutes = router;
