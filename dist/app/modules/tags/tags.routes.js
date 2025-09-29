"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagRoutes = void 0;
const express_1 = __importDefault(require("express"));
const tags_controllers_1 = require("./tags.controllers");
const router = express_1.default.Router();
router.get("/", tags_controllers_1.tagControllers.getAllTags);
router.get("/:id", tags_controllers_1.tagControllers.getSingleTag);
router.post("/create-tag", tags_controllers_1.tagControllers.createTag);
router.delete("/delete-tag/:id", tags_controllers_1.tagControllers.deleteTag);
router.patch("/update-tag/:id", tags_controllers_1.tagControllers.updateTag);
exports.TagRoutes = router;
