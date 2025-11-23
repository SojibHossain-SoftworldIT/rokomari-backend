import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { footerSettingsServices } from "./footer-settings.service";

const createFooterSettings = catchAsync(async (req, res) => {
  const result = await footerSettingsServices.createFooterSettingsOnDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Footer settings created successfully!",
    data: result,
  });
});

const getFooterSettings = catchAsync(async (req, res) => {
  const result = await footerSettingsServices.getFooterSettingsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Footer settings retrieved successfully!",
    data: result,
  });
});

const getAllFooterSettings = catchAsync(async (req, res) => {
  const result = await footerSettingsServices.getAllFooterSettingsFromDB();
  
  // DEBUG: Check what's actually in the first submenu
  if (result && result[0]) {
    console.log('🔍 GET ALL DEBUG - Document ID:', result[0]._id);
    if (result[0].menus && result[0].menus[0] && result[0].menus[0].submenus && result[0].menus[0].submenus[0]) {
      console.log('🔍 GET ALL DEBUG - First submenu:', JSON.stringify(result[0].menus[0].submenus[0], null, 2));
    }
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All footer settings retrieved successfully!",
    data: result,
  });
});

const getFooterSettingsById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await footerSettingsServices.getFooterSettingsByIdFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Footer settings retrieved successfully!",
    data: result,
  });
});

const updateFooterSettings = catchAsync(async (req, res) => {
  const { id } = req.params;
  const files = (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};
  
  // Process any uploaded hero images for submenus
  const updateData = { ...req.body };
  if (files["heroImage"]?.length) {
    // This would need more complex logic to map images to specific submenus
    // For now, we'll handle it in the service layer
    updateData.uploadedHeroImage = files["heroImage"][0].path;
  }

  const result = await footerSettingsServices.updateFooterSettingsOnDB(id, updateData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Footer settings updated successfully!",
    data: result,
  });
});

const deleteFooterSettings = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await footerSettingsServices.deleteFooterSettingsFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Footer settings deleted successfully!",
    data: result,
  });
});

const getActiveFooterMenus = catchAsync(async (req, res) => {
  const result = await footerSettingsServices.getActiveFooterMenusFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Active footer menus retrieved successfully!",
    data: result,
  });
});



const clearAllFooterSettings = catchAsync(async (req, res) => {
  const result = await footerSettingsServices.clearAllFooterSettingsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All footer settings cleared successfully!",
    data: result,
  });
});

const getFooterWithDynamicPageStatus = catchAsync(async (req, res) => {
  const result = await footerSettingsServices.getFooterWithDynamicPageStatusFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Footer settings with dynamic page status retrieved successfully!",
    data: result,
  });
});

const getPageContentBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const result = await footerSettingsServices.getPageContentBySlugFromDB(slug);

  if (!result) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: "Page not found!",
      data: null,
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Page content retrieved successfully!",
    data: result,
  });
});

const getAvailableDynamicPages = catchAsync(async (req, res) => {
  const result = await footerSettingsServices.getAvailableDynamicPagesFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Available dynamic pages retrieved successfully!",
    data: result,
  });
});

const createSubmenuWithDynamicPage = catchAsync(async (req, res) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const heroImage = files?.heroImage?.length ? files.heroImage[0].path : undefined;

  const payload = {
    ...req.body,
    heroImage
  };

  const result = await footerSettingsServices.createSubmenuWithDynamicPageFromDB(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Submenu with dynamic page created successfully!",
    data: result,
  });
});

export const footerSettingsControllers = {
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