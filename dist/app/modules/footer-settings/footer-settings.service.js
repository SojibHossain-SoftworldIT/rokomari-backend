"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.footerSettingsServices = void 0;
const footer_settings_model_1 = require("./footer-settings.model");
const dynamic_pages_model_1 = require("../dynamic-pages/dynamic-pages.model");
const createFooterSettingsOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield footer_settings_model_1.FooterSettingsModel.create(payload);
    return result;
});
const getFooterSettingsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield footer_settings_model_1.FooterSettingsModel.findOne({ isActive: true }).sort({ createdAt: -1 });
    return result;
});
const getAllFooterSettingsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield footer_settings_model_1.FooterSettingsModel.find().sort({ updatedAt: -1 });
    return result;
});
const getFooterSettingsByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield footer_settings_model_1.FooterSettingsModel.findById(id);
    return result;
});
const updateFooterSettingsOnDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield footer_settings_model_1.FooterSettingsModel.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const deleteFooterSettingsFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield footer_settings_model_1.FooterSettingsModel.findByIdAndDelete(id);
    return result;
});
const getActiveFooterMenusFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const footerSettings = yield footer_settings_model_1.FooterSettingsModel.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!footerSettings)
        return [];
    return footerSettings.menus
        .filter(menu => menu.isActive)
        .sort((a, b) => a.order - b.order)
        .map(menu => ({
        menuTitle: menu.menuTitle,
        submenus: menu.submenus.filter(submenu => submenu.isActive)
    }));
});
const clearAllFooterSettingsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield footer_settings_model_1.FooterSettingsModel.deleteMany({});
    return result;
});
const getFooterWithDynamicPageStatusFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const footerSettings = yield footer_settings_model_1.FooterSettingsModel.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!footerSettings)
        return null;
    const dynamicPages = yield dynamic_pages_model_1.DynamicPageModel.find({ isActive: true });
    const dynamicPageSlugs = dynamicPages.map(page => page.slug);
    const menusWithStatus = footerSettings.menus.map(menu => (Object.assign(Object.assign({}, JSON.parse(JSON.stringify(menu))), { submenus: menu.submenus.map(submenu => (Object.assign(Object.assign({}, submenu), { dynamicPageExists: submenu.isDynamicPage ? dynamicPageSlugs.includes(submenu.url.replace('/', '')) : false }))) })));
    return Object.assign(Object.assign({}, JSON.parse(JSON.stringify(footerSettings))), { menus: menusWithStatus });
});
const getPageContentBySlugFromDB = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    // First check if it's a dynamic page
    const dynamicPage = yield dynamic_pages_model_1.DynamicPageModel.findOne({ slug, isActive: true });
    if (dynamicPage) {
        return {
            type: 'dynamic-page',
            data: dynamicPage
        };
    }
    // Then check if it's in footer settings submenus
    const footerSettings = yield footer_settings_model_1.FooterSettingsModel.findOne({ isActive: true });
    if (footerSettings) {
        for (const menu of footerSettings.menus) {
            const submenu = menu.submenus.find(sub => sub.url === `/${slug}` || sub.url === slug);
            if (submenu && submenu.isDynamicPage) {
                return {
                    type: 'footer-submenu',
                    data: submenu
                };
            }
        }
    }
    return null;
});
const getAvailableDynamicPagesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const dynamicPages = yield dynamic_pages_model_1.DynamicPageModel.find({ isActive: true }).select('_id title slug');
    return dynamicPages.map(page => ({
        id: page._id,
        title: page.title,
        slug: page.slug,
        url: `/${page.slug}`
    }));
});
const createSubmenuWithDynamicPageFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { menuTitle, submenuTitle, slug, pageContent, pageTitle, pageDescription, metaTitle, metaDescription, heroImage } = payload;
    // Create dynamic page first
    const dynamicPage = yield dynamic_pages_model_1.DynamicPageModel.create({
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
    let footerSettings = yield footer_settings_model_1.FooterSettingsModel.findOne({ isActive: true });
    if (!footerSettings) {
        footerSettings = yield footer_settings_model_1.FooterSettingsModel.create({
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
    }
    else {
        // Find existing menu or create new one
        let menu = footerSettings.menus.find(m => m.menuTitle === menuTitle);
        if (menu) {
            menu.submenus.push({
                title: submenuTitle,
                url: `/${slug}`,
                isDynamicPage: true,
                isActive: true
            });
        }
        else {
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
        yield footerSettings.save();
    }
    return {
        dynamicPage,
        footerSettings
    };
});
exports.footerSettingsServices = {
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
