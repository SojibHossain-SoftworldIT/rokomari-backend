"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FooterSettingsModel = void 0;
const mongoose_1 = require("mongoose");
const footerSubmenuSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    isDynamicPage: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, { _id: false });
const footerMenuSchema = new mongoose_1.Schema({
    menuTitle: { type: String, required: true, trim: true },
    submenus: [footerSubmenuSchema],
    isActive: { type: Boolean, default: true },
    order: { type: Number, required: true },
}, { _id: false });
const footerSettingsSchema = new mongoose_1.Schema({
    menus: [footerMenuSchema],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.FooterSettingsModel = (0, mongoose_1.model)("FooterSettingsV2", footerSettingsSchema);
