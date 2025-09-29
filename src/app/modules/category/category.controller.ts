import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { categoryServices } from "./category.service";

const getAllCategory = catchAsync(async (req, res) => {
  const result = await categoryServices.getAllCategoryFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories retrieved successfully!",
    data: result,
  });
});

const getSingleCategory = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await categoryServices.getSingleCategoryFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category retrieved successfully!",
    data: result,
  });
});

const createCategory = catchAsync(async (req, res) => {
  const files =
    (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

  const categoryData = {
    ...req.body,
    image: files["imageFile"]?.[0]?.path || req.body.image || "",
  };

  const result = await categoryServices.createCategoryIntoDB(categoryData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Category created successfully!",
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const id = req.params.id;
  const files =
    (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

  const updatedData: any = { ...req.body };

  if (files["imageFile"]?.[0]?.path) {
    updatedData.image = files["imageFile"][0].path;
  }

  const result = await categoryServices.updateCategoryInDB(id, updatedData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category updated successfully!",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await categoryServices.deleteCategoryFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category deleted successfully!",
    data: result,
  });
});

export const categoryControllers = {
  getAllCategory,
  getSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
