import { z } from "zod";

const footerSubmenuValidation = z.object({
  title: z.string().min(1, "Submenu title is required"),
  url: z.string().min(1, "Submenu URL is required"),
  isDynamicPage: z.boolean().optional().default(false),
  dynamicPageSlug: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

const footerMenuValidation = z.object({
  menuTitle: z.string().min(1, "Menu title is required"),
  submenus: z.array(footerSubmenuValidation).min(1, "At least one submenu is required"),
  isActive: z.boolean().optional().default(true),
  order: z.number().min(1, "Order must be at least 1"),
});

const createFooterSettingsValidation = z.object({
  menus: z.array(footerMenuValidation).min(1, "At least one menu is required"),
  isActive: z.boolean().optional().default(true),
});

const updateFooterSettingsValidation = z.object({
  menus: z.array(footerMenuValidation).optional(),
  isActive: z.boolean().optional(),
});

const createSubmenuWithDynamicPageValidation = z.object({
  footerSettingsId: z.string().min(1, "Footer settings ID is required"),
  menuIndex: z.number().min(0, "Menu index must be 0 or greater"),
  submenu: z.object({
    title: z.string().min(1, "Submenu title is required"),
    url: z.string().min(1, "Submenu URL is required"),
    createDynamicPage: z.boolean(),
    pageData: z.object({
      title: z.string().min(1, "Page title is required"),
      description: z.string().min(1, "Page description is required"),
      content: z.string().min(1, "Page content is required"),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    }).optional(),
  }),
});

export const footerSettingsValidations = {
  createFooterSettingsValidation,
  updateFooterSettingsValidation,
  createSubmenuWithDynamicPageValidation,
};