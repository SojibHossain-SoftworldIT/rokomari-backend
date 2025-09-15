import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { tagServices } from "./tags.services";

const getAllTags = catchAsync(async (req, res) => {
  const result = await tagServices.getAllTagsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tags retrieve successfully!",
    data: result,
  });
});

const getSingleTag = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await tagServices.getSingleTagFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tag data retrieve successfully!",
    data: result,
  });
});

const createTag = catchAsync(async (req, res) => {
  const tagData = req.body;
  const result = await tagServices.createTagOnDB(tagData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tag created successfully!",
    data: result,
  });
});

export const tagControllers = {
  getAllTags,
  getSingleTag,
  createTag,
};
