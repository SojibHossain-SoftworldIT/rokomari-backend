"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicPageModel = void 0;
const mongoose_1 = require("mongoose");
const dynamicPageSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    pageTitle: { type: String, trim: true },
    pageDescription: { type: String },
    heroImage: { type: String },
    pageContent: { type: String },
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.DynamicPageModel = (0, mongoose_1.model)("DynamicPage", dynamicPageSchema);
