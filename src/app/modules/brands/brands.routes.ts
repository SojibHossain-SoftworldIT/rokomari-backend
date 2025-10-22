import express from "express";
import { multerUpload } from "../../config/multer.config";
import { brandsControllers } from "./brands.controller";
// import upload from "../../middlewares/upload"; // ✅ your multer middleware

const router = express.Router();

router.get("/", brandsControllers.getAllBrands);
router.get("/:id", brandsControllers.getSingleBrand);

router.post(
  "/create-brand",
  multerUpload.fields([
    { name: "iconFile", maxCount: 1 },
    { name: "imagesFiles", maxCount: 10 },
  ]),
  brandsControllers.createBrand
);

router.patch(
  "/update-brand/:id",
  multerUpload.fields([
    { name: "iconFile", maxCount: 1 },
    { name: "imagesFiles", maxCount: 10 },
  ]),
  brandsControllers.updateBrand
);

router.delete("/delete-brand/:id", brandsControllers.deleteBrand);

export const BrandRoutes = router;
