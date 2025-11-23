import { TFooterSettings } from "./footer-settings.interface";
import { FooterSettingsModel } from "./footer-settings.model";
import { DynamicPageModel } from "../dynamic-pages/dynamic-pages.model";

const createFooterSettingsOnDB = async (payload: TFooterSettings) => {
  const result = await FooterSettingsModel.create(payload);
  return result;
};

const getFooterSettingsFromDB = async () => {
  const result = await FooterSettingsModel.findOne({ isActive: true }).sort({ createdAt: -1 });
  return result;
};

const getAllFooterSettingsFromDB = async () => {
  const result = await FooterSettingsModel.find().sort({ updatedAt: -1 });
  return result;
};

const getFooterSettingsByIdFromDB = async (id: string) => {
  const result = await FooterSettingsModel.findById(id);
  return result;
};

const updateFooterSettingsOnDB = async (id: string, payload: Partial<TFooterSettings>) => {
  const result = await FooterSettingsModel.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteFooterSettingsFromDB = async (id: string) => {
  const result = await FooterSettingsModel.findByIdAndDelete(id);
  return result;
};

const getActiveFooterMenusFromDB = async () => {
  const footerSettings = await FooterSettingsModel.findOne({ isActive: true }).sort({ createdAt: -1 });
  if (!footerSettings) return [];
  
  return footerSettings.menus
    .filter(menu => menu.isActive)
    .sort((a, b) => a.order - b.order)
    .map(menu => ({
      menuTitle: menu.menuTitle,
      submenus: menu.submenus.filter(submenu => submenu.isActive)
    }));
};

const clearAllFooterSettingsFromDB = async () => {
  const result = await FooterSettingsModel.deleteMany({});
  return result;
};

const getFooterWithDynamicPageStatusFromDB = async () => {
  const footerSettings = await FooterSettingsModel.findOne({ isActive: true }).sort({ createdAt: -1 });
  if (!footerSettings) return null;

  const dynamicPages = await DynamicPageModel.find({ isActive: true });
  const dynamicPageSlugs = dynamicPages.map(page => page.slug);

  const menusWithStatus = footerSettings.menus.map(menu => ({
    ...JSON.parse(JSON.stringify(menu)),
    submenus: menu.submenus.map(submenu => ({
      ...submenu,
      dynamicPageExists: submenu.isDynamicPage ? dynamicPageSlugs.includes(submenu.url.replace('/', '')) : false
    }))
  }));

  return {
    ...JSON.parse(JSON.stringify(footerSettings)),
    menus: menusWithStatus
  };
};

const getPageContentBySlugFromDB = async (slug: string) => {
  // First check if it's a dynamic page
  const dynamicPage = await DynamicPageModel.findOne({ slug, isActive: true });
  if (dynamicPage) {
    return {
      type: 'dynamic-page',
      data: dynamicPage
    };
  }

  // Then check if it's in footer settings submenus
  const footerSettings = await FooterSettingsModel.findOne({ isActive: true });
  if (footerSettings) {
    for (const menu of footerSettings.menus) {
      const submenu = menu.submenus.find(sub => 
        sub.url === `/${slug}` || sub.url === slug
      );
      if (submenu && submenu.isDynamicPage) {
        return {
          type: 'footer-submenu',
          data: submenu
        };
      }
    }
  }

  return null;
};

const getAvailableDynamicPagesFromDB = async () => {
  const dynamicPages = await DynamicPageModel.find({ isActive: true }).select('_id title slug');
  return dynamicPages.map(page => ({
    id: page._id,
    title: page.title,
    slug: page.slug,
    url: `/${page.slug}`
  }));
};

const createSubmenuWithDynamicPageFromDB = async (payload: any) => {
  const { menuTitle, submenuTitle, slug, pageContent, pageTitle, pageDescription, metaTitle, metaDescription, heroImage } = payload;

  // Create dynamic page first
  const dynamicPage = await DynamicPageModel.create({
    title: pageTitle || submenuTitle,
    slug,
    pageTitle,
    pageDescription,
    pageContent,
    metaTitle,
    metaDescription,
    heroImage,
    isActive: true
  });

  // Create or update footer settings
  let footerSettings = await FooterSettingsModel.findOne({ isActive: true });
  
  if (!footerSettings) {
    footerSettings = await FooterSettingsModel.create({
      menus: [{
        menuTitle,
        order: 1,
        isActive: true,
        submenus: [{
          title: submenuTitle,
          url: `/${slug}`,
          isDynamicPage: true,
          isActive: true
        }]
      }],
      isActive: true
    });
  } else {
    // Find existing menu or create new one
    let menu = footerSettings.menus.find(m => m.menuTitle === menuTitle);
    
    if (menu) {
      menu.submenus.push({
        title: submenuTitle,
        url: `/${slug}`,
        isDynamicPage: true,
        isActive: true
      });
    } else {
      footerSettings.menus.push({
        menuTitle,
        order: footerSettings.menus.length + 1,
        isActive: true,
        submenus: [{
          title: submenuTitle,
          url: `/${slug}`,
          isDynamicPage: true,
          isActive: true
        }]
      });
    }
    
    await footerSettings.save();
  }

  return {
    dynamicPage,
    footerSettings
  };
};

export const footerSettingsServices = {
  createFooterSettingsOnDB,
  getFooterSettingsFromDB,
  getAllFooterSettingsFromDB,
  getFooterSettingsByIdFromDB,
  updateFooterSettingsOnDB,
  deleteFooterSettingsFromDB,
  getActiveFooterMenusFromDB,
  clearAllFooterSettingsFromDB,
  getFooterWithDynamicPageStatusFromDB,
  getPageContentBySlugFromDB,
  getAvailableDynamicPagesFromDB,
  createSubmenuWithDynamicPageFromDB,
};