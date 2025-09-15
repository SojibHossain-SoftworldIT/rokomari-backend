import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { categoryServices } from "./category.service";
import httpStatus from "http-status";

const getAllCategory = catchAsync(async (req, res) => {
  const result = await categoryServices.getAllCategoryFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories retrieve successfully!",
    data: result,
  });
});

const getSingleCategory = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await categoryServices.getSingleCategoryFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category retrieve successfully!",
    data: result,
  });
});

const createCategory = catchAsync(async (req, res) => {
  const categoryData = req.body;
  const result = await categoryServices.createCategoryIntoDB(categoryData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category created successfully!",
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
  deleteCategory,
};
