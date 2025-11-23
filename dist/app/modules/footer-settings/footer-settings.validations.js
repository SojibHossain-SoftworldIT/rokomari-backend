"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.footerSettingsValidations = void 0;
const zod_1 = require("zod");
const footerSubmenuValidation = zod_1.z.object({
    title: zod_1.z.string().min(1, "Submenu title is required"),
    url: zod_1.z.string().min(1, "Submenu URL is required"),
    isDynamicPage: zod_1.z.boolean().optional().default(false),
    dynamicPageSlug: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional().default(true),
});
const footerMenuValidation = zod_1.z.object({
    menuTitle: zod_1.z.string().min(1, "Menu title is required"),
    submenus: zod_1.z.array(footerSubmenuValidation).min(1, "At least one submenu is required"),
    isActive: zod_1.z.boolean().optional().default(true),
    order: zod_1.z.number().min(1, "Order must be at least 1"),
});
const createFooterSettingsValidation = zod_1.z.object({
    menus: zod_1.z.array(footerMenuValidation).min(1, "At least one menu is required"),
    isActive: zod_1.z.boolean().optional().default(true),
});
const updateFooterSettingsValidation = zod_1.z.object({
    menus: zod_1.z.array(footerMenuValidation).optional(),
    isActive: zod_1.z.boolean().optional(),
});
const createSubmenuWithDynamicPageValidation = zod_1.z.object({
    footerSettingsId: zod_1.z.string().min(1, "Footer settings ID is required"),
    menuIndex: zod_1.z.number().min(0, "Menu index must be 0 or greater"),
    submenu: zod_1.z.object({
        title: zod_1.z.string().min(1, "Submenu title is required"),
        url: zod_1.z.string().min(1, "Submenu URL is required"),
        createDynamicPage: zod_1.z.boolean(),
        pageData: zod_1.z.object({
            title: zod_1.z.string().min(1, "Page title is required"),
            description: zod_1.z.string().min(1, "Page description is required"),
            content: zod_1.z.string().min(1, "Page content is required"),
            metaTitle: zod_1.z.string().optional(),
            metaDescription: zod_1.z.string().optional(),
        }).optional(),
    }),
});
exports.footerSettingsValidations = {
    createFooterSettingsValidation,
    updateFooterSettingsValidation,
    createSubmenuWithDynamicPageValidation,
};
