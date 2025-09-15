import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { shopControllers } from "./shop.controller";
import { createShopZodSchema } from "./shop.validations";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

router.get("/", shopControllers.getAllShop);

router.get("/:id", shopControllers.getSingleShop);

router.post(
  '/create-shop',
  multerUpload.fields([
    { name: 'shopLogofile', maxCount: 1 },
    { name: 'shopCoverFile', maxCount: 1 },
  ]),
  validateRequest(createShopZodSchema),
  shopControllers.createShop
);

export const ShopRoutes = router;
