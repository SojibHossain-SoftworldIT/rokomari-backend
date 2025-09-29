import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { categoryControllers } from "./category.controller";
import { createCategoryZodSchema } from "./category.validations";

const router = express.Router();

router.get("/", categoryControllers.getAllCategory);

router.get("/:id", categoryControllers.getSingleCategory);

router.post(
  "/create-category",
  validateRequest(createCategoryZodSchema),
  categoryControllers.createCategory
);

router.patch("/update-category/:id", categoryControllers.updateCategory);

router.delete("/delete-category/:id", categoryControllers.deleteCategory);

export const CategoryRoutes = router;
