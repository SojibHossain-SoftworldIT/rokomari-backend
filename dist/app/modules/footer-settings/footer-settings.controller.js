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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.footerSettingsControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const footer_settings_service_1 = require("./footer-settings.service");
const createFooterSettings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield footer_settings_service_1.footerSettingsServices.createFooterSettingsOnDB(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Footer settings created successfully!",
        data: result,
    });
}));
const getFooterSettings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield footer_settings_service_1.footerSettingsServices.getFooterSettingsFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Footer settings retrieved successfully!",
        data: result,
    });
}));
const getAllFooterSettings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield footer_settings_service_1.footerSettingsServices.getAllFooterSettingsFromDB();
    // DEBUG: Check what's actually in the first submenu
    if (result && result[0]) {
        console.log('🔍 GET ALL DEBUG - Document ID:', result[0]._id);
        if (result[0].menus && result[0].menus[0] && result[0].menus[0].submenus && result[0].menus[0].submenus[0]) {
            console.log('🔍 GET ALL DEBUG - First submenu:', JSON.stringify(result[0].menus[0].submenus[0], null, 2));
        }
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "All footer settings retrieved successfully!",
        data: result,
    });
}));
const getFooterSettingsById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield footer_settings_service_1.footerSettingsServices.getFooterSettingsByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Footer settings retrieved successfully!",
        data: result,
    });
}));
const updateFooterSettings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const files = req.files || {};
    // Process any uploaded hero images for submenus
    const updateData = Object.assign({}, req.body);
    if ((_a = files["heroImage"]) === null || _a === void 0 ? void 0 : _a.length) {
        // This would need more complex logic to map images to specific submenus
        // For now, we'll handle it in the service layer
        updateData.uploadedHeroImage = files["heroImage"][0].path;
    }
    const result = yield footer_settings_service_1.footerSettingsServices.updateFooterSettingsOnDB(id, updateData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Footer settings updated successfully!",
        data: result,
    });
}));
const deleteFooterSettings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield footer_settings_service_1.footerSettingsServices.deleteFooterSettingsFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Footer settings deleted successfully!",
        data: result,
    });
}));
const getActiveFooterMenus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield footer_settings_service_1.footerSettingsServices.getActiveFooterMenusFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Active footer menus retrieved successfully!",
        data: result,
    });
}));
const clearAllFooterSettings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield footer_settings_service_1.footerSettingsServices.clearAllFooterSettingsFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "All footer settings cleared successfully!",
        data: result,
    });
}));
const getFooterWithDynamicPageStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield footer_settings_service_1.footerSettingsServices.getFooterWithDynamicPageStatusFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Footer settings with dynamic page status retrieved successfully!",
        data: result,
    });
}));
const getPageContentBySlug = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const result = yield footer_settings_service_1.footerSettingsServices.getPageContentBySlugFromDB(slug);
    if (!result) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_1.default.NOT_FOUND,
            message: "Page not found!",
            data: null,
        });
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Page content retrieved successfully!",
        data: result,
    });
}));
const getAvailableDynamicPages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield footer_settings_service_1.footerSettingsServices.getAvailableDynamicPagesFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Available dynamic pages retrieved successfully!",
        data: result,
    });
}));
const createSubmenuWithDynamicPage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const files = req.files;
    const heroImage = ((_a = files === null || files === void 0 ? void 0 : files.heroImage) === null || _a === void 0 ? void 0 : _a.length) ? files.heroImage[0].path : undefined;
    const payload = Object.assign(Object.assign({}, req.body), { heroImage });
    const result = yield footer_settings_service_1.footerSettingsServices.createSubmenuWithDynamicPageFromDB(payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Submenu with dynamic page created successfully!",
        data: result,
    });
}));
exports.footerSettingsControllers = {
    createFooterSettings,
    getFooterSettings,
    getAllFooterSettings,
    getFooterSettingsById,
    updateFooterSettings,
    deleteFooterSettings,
    getActiveFooterMenus,
    clearAllFooterSettings,
    getFooterWithDynamicPageStatus,
    getPageContentBySlug,
    getAvailableDynamicPages,
    createSubmenuWithDynamicPage,
};
