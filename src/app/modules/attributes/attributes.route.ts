import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { attributeControllers } from "./attributes.controller";
import { createAttributesZodSchema } from "./attributes.validations";

const router = express.Router();

router.get("/", attributeControllers.getAllAttributes);

router.get("/:id", attributeControllers.getSingleAttribute);

router.post(
  "/create-attribute",
  validateRequest(createAttributesZodSchema),
  attributeControllers.createAttribute
);

export const AttributeRoutes = router;
