import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { productControllers } from "./product.controller";
import { createProductZodSchema, updateProductZodSchema } from "./product.validations";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

router.get("/", productControllers.getAllProduct);

router.get("/:id", productControllers.getSingleProduct);

router.get('/products/by', productControllers.getProductsByCategoryandTag)

router.post(
  '/create-product',
  multerUpload.fields([
    { name: 'galleryImagesFiles' , maxCount: 20},
    { name: 'featuredImgFile', maxCount: 1 },
  ]),
  validateRequest(createProductZodSchema),
  productControllers.createProduct
);

router.patch(
  '/update-product/:id',
  multerUpload.fields([
    { name: 'galleryImagesFiles', maxCount: 20 },
    { name: 'featuredImgFile', maxCount: 1 },
  ]),
  validateRequest(updateProductZodSchema),
  productControllers.updateProduct
);

export const ProductRoutes = router;
