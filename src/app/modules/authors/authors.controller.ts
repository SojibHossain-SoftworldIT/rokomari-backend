import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authorsServices } from "./authors.service";

const createAuthor = catchAsync(async (req, res) => {
  const files =
    (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

  const authorData = {
    ...req.body,
    image: files["image"]?.[0]?.path || req.body.image || "",
  };

  const result = await authorsServices.createAuthorIntoDB(authorData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Author created successfully!",
    data: result,
  });
});

const getAllAuthors = catchAsync(async (req, res) => {
  const result = await authorsServices.getAuthorsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Authors retrieved successfully!",
    data: result,
  });
});

const getSingleAuthor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await authorsServices.getSingleAuthorFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Author retrieved successfully!",
    data: result,
  });
});

const updateAuthor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const files =
    (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

  const updatedData: any = {
    ...req.body,
  };

  if (files["image"]?.[0]?.path) {
    updatedData.image = files["image"][0].path;
  } else if (req.body.image) {
    updatedData.image = req.body.image;
  }

  const result = await authorsServices.updateAuthorInDB(id, updatedData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Author updated successfully!",
    data: result,
  });
});

const deleteAuthor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await authorsServices.deleteAuthorFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Author deleted successfully!",
    data: result,
  });
});

// ✅ Custom endpoint for following an author (increment followers)
const followAuthor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await authorsServices.updateAuthorInDB(id, {
    increaseFollowers: true,
  } as any);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Author followed successfully!",
    data: result,
  });
});

export const authorsControllers = {
  createAuthor,
  getAllAuthors,
  getSingleAuthor,
  updateAuthor,
  deleteAuthor,
  followAuthor,
};
