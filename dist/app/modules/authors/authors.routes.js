"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_config_1 = require("../../config/multer.config");
const authors_controller_1 = require("./authors.controller");
// import { upload } from "../../config/multer.config";
const router = express_1.default.Router();
router.get("/", authors_controller_1.authorsControllers.getAllAuthors);
router.get("/:id", authors_controller_1.authorsControllers.getSingleAuthor);
router.post("/create", multer_config_1.multerUpload.fields([{ name: "image", maxCount: 1 }]), authors_controller_1.authorsControllers.createAuthor);
router.patch("/:id", multer_config_1.multerUpload.fields([{ name: "image", maxCount: 1 }]), authors_controller_1.authorsControllers.updateAuthor);
router.delete("/:id", authors_controller_1.authorsControllers.deleteAuthor);
// ✅ New endpoint for following an author
router.patch("/:id/follow", authors_controller_1.authorsControllers.followAuthor);
exports.AuthorRoutes = router;
