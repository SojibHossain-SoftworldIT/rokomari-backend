import express from "express";
import { multerUpload } from "../../config/multer.config";
import validateRequest from "../../middlewares/validateRequest";
import { tagControllers } from "./tags.controllers";
import { createTagZodSchema } from "./tags.validations";

const router = express.Router();

router.get("/", tagControllers.getAllTags);

router.get("/:id", tagControllers.getSingleTag);

router.post(
  "/create-tag",
  multerUpload.fields([
    { name: "imageFile", maxCount: 1 },
    { name: "iconFile", maxCount: 1 },
  ]),
  validateRequest(createTagZodSchema),
  tagControllers.createTag
);

router.patch(
  "/update-tag/:id",
  multerUpload.fields([
    { name: "imageFile", maxCount: 1 },
    { name: "iconFile", maxCount: 1 },
  ]),
  tagControllers.updateTag
);

router.delete("/delete-tag/:id", tagControllers.deleteTag);

export const TagRoutes = router;
