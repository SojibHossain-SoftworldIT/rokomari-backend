import express from "express";
import { tagControllers } from "./tags.controllers";

const router = express.Router();

router.get("/", tagControllers.getAllTags);

router.get("/:id", tagControllers.getSingleTag);

router.post("/create-tag", tagControllers.createTag);

router.delete("/delete-tag/:id", tagControllers.deleteTag);

export const TagRoutes = router;
