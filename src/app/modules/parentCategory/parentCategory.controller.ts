import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { parentCategoryServices } from "./parentCategory.service";

const createParentCategory = catchAsync(async (req: Request, res: Response) => {
  const parentCategoryData = req.body;
  const result = await parentCategoryServices.createParentCategoryInDB(
    parentCategoryData
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Parent Category created successfully!",
    data: result,
  });
});

const getAllParentCategories = catchAsync(
  async (req: Request, res: Response) => {
    const result = await parentCategoryServices.getAllParentCategoriesFromDB(
      req.query
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parent Categories retrieved successfully!",
      data: result,
    });
  }
);

const getSingleParentCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await parentCategoryServices.getSingleParentCategoryFromDB(
      id
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parent Category retrieved successfully!",
      data: result,
    });
  }
);

const updateParentCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await parentCategoryServices.updateParentCategoryInDB(
    id,
    updateData
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parent Category updated successfully!",
    data: result,
  });
});

const deleteParentCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await parentCategoryServices.deleteParentCategoryFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parent Category deleted successfully!",
    data: result,
  });
});

export const parentCategoryControllers = {
  createParentCategory,
  getAllParentCategories,
  getSingleParentCategory,
  updateParentCategory,
  deleteParentCategory,
};
