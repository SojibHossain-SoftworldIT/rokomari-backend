import express from "express";
import { parentCategoryControllers } from "./parentCategory.controller";
import validateRequest from "../../middlewares/validateRequest";
import { parentCategoryValidation } from "./parentCategory.validations";

const router = express.Router();

// Create Parent Category
router.post(
  "/create-parent-category",
  validateRequest(parentCategoryValidation.createParentCategoryZodSchema),
  parentCategoryControllers.createParentCategory
);

// Get All Parent Categories
router.get("/", parentCategoryControllers.getAllParentCategories);

// Get Single Parent Category
router.get("/:id", parentCategoryControllers.getSingleParentCategory);

// Update Parent Category
router.patch(
  "/:id",
  validateRequest(parentCategoryValidation.updateParentCategoryZodSchema),
  parentCategoryControllers.updateParentCategory
);

router.delete("/:id", parentCategoryControllers.deleteParentCategory);

export const ParentCategoryRoutes = router;
