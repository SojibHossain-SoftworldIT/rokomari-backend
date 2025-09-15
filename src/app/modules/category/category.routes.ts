import express from "express";
import { categoryControllers } from "./category.controller";
import validateRequest from "../../middlewares/validateRequest";
import { createCategoryZodSchema } from "./category.validations";

const router = express.Router();

router.get("/", categoryControllers.getAllCategory);

router.get("/:id", categoryControllers.getSingleCategory);

router.post(
  "/create-category",
  validateRequest(createCategoryZodSchema),
  categoryControllers.createCategory
);

router.delete("/delete-category/:id", categoryControllers.deleteCategory);

export const CategoryRoutes = router;
