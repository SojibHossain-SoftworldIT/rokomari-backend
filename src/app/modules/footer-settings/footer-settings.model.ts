import { Schema, model } from "mongoose";
import { TFooterSettings } from "./footer-settings.interface";

const footerSubmenuSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    isDynamicPage: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const footerMenuSchema = new Schema(
  {
    menuTitle: { type: String, required: true, trim: true },
    submenus: [footerSubmenuSchema],
    isActive: { type: Boolean, default: true },
    order: { type: Number, required: true },
  },
  { _id: false }
);

const footerSettingsSchema = new Schema<TFooterSettings>(
  {
    menus: [footerMenuSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const FooterSettingsModel = model<TFooterSettings>("FooterSettingsV2", footerSettingsSchema);