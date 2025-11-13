import express from "express";
import { multerUpload } from "../../config/multer.config";
import validateRequest from "../../middlewares/validateRequest";
import { productControllers } from "./product.controller";
import {
  createProductZodSchema,
  updateProductZodSchema,
} from "./product.validations";

const router = express.Router();

router.get("/", productControllers.getAllProduct);

router.get("/search", productControllers.searchProducts);

router.get("/popular-products", productControllers.getPopularProducts);

router.get("/:id", productControllers.getSingleProduct);

router.get("/products/by", productControllers.getProductsByCategoryandTag);

router.get("/by-author/:authorId", productControllers.getProductsByAuthor);

router.post(
  "/create-product",
  multerUpload.fields([
    { name: "galleryImagesFiles", maxCount: 5 },
    { name: "featuredImgFile", maxCount: 1 },
    { name: "previewImgFile", maxCount: 20 },
    // ...Array.from({ length: 10 }).map((_, i) => ({
    //   name: `authorImage_${i}`,
    //   maxCount: 1,
    // })),
  ]),
  validateRequest(createProductZodSchema),
  productControllers.createProduct
);

router.patch(
  "/update-product/:id",
  multerUpload.fields([
    { name: "galleryImagesFiles", maxCount: 5 },
    { name: "featuredImgFile", maxCount: 1 },
    { name: "previewImgFile", maxCount: 20 },
    // ...Array.from({ length: 10 }).map((_, i) => ({
    //   name: `authorImage_${i}`,
    //   maxCount: 1,
    // })),
  ]),
  validateRequest(updateProductZodSchema),
  productControllers.updateProduct
);

router.delete("/delete-product/:id", productControllers.deleteSingleProduct);

export const ProductRoutes = router;
