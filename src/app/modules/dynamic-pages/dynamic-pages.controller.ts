import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { dynamicPagesServices } from "./dynamic-pages.service";

const createDynamicPage = catchAsync(async (req, res) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const heroImage = files?.heroImage?.length ? files.heroImage[0].path : undefined;

  const pageData = {
    ...req.body,
    heroImage,
  };

  const result = await dynamicPagesServices.createDynamicPageOnDB(pageData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Dynamic page created successfully!",
    data: result,
  });
});

const getAllDynamicPages = catchAsync(async (req, res) => {
  const result = await dynamicPagesServices.getAllDynamicPagesFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Dynamic pages retrieved successfully!",
    data: result,
  });
});

const getDynamicPageById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await dynamicPagesServices.getDynamicPageByIdFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Dynamic page retrieved successfully!",
    data: result,
  });
});

const getDynamicPageBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const result = await dynamicPagesServices.getDynamicPageBySlugFromDB(slug);

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
    message: "Dynamic page retrieved successfully!",
    data: result,
  });
});

const updateDynamicPage = catchAsync(async (req, res) => {
  const { id } = req.params;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  
  const updateData = { ...req.body };
  if (files?.heroImage?.length) {
    updateData.heroImage = files.heroImage[0].path;
  }

  const result = await dynamicPagesServices.updateDynamicPageOnDB(id, updateData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Dynamic page updated successfully!",
    data: result,
  });
});

const deleteDynamicPage = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await dynamicPagesServices.deleteDynamicPageFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Dynamic page deleted successfully!",
    data: result,
  });
});

export const dynamicPagesControllers = {
  createDynamicPage,
  getAllDynamicPages,
  getDynamicPageById,
  getDynamicPageBySlug,
  updateDynamicPage,
  deleteDynamicPage,
};