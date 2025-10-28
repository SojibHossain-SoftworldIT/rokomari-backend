import express from "express";
import { multerUpload } from "../../config/multer.config";
import { authorsControllers } from "./authors.controller";
// import { upload } from "../../config/multer.config";

const router = express.Router();

router.get("/", authorsControllers.getAllAuthors);
router.get("/:id", authorsControllers.getSingleAuthor);

router.post(
  "/create",
  multerUpload.fields([{ name: "image", maxCount: 1 }]),
  authorsControllers.createAuthor
);

router.patch(
  "/:id",
  multerUpload.fields([{ name: "image", maxCount: 1 }]),
  authorsControllers.updateAuthor
);

router.delete("/:id", authorsControllers.deleteAuthor);

// ✅ New endpoint for following an author
router.patch("/:id/follow", authorsControllers.followAuthor);

export const AuthorRoutes = router;
