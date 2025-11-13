import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { reviewServices } from "./review.service";

// ✅ Create Review
const createReview = catchAsync(async (req, res) => {
  const files =
    (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

  const photos = files["photos"] ? files["photos"].map((f) => f.path) : [];

  const reviewData = {
    ...req.body,
    photos,
  };

  const result = await reviewServices.createReviewOnDB(reviewData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review created successfully! Waiting for admin approval.",
    data: result,
  });
});

// ✅ Get all reviews
const getAllReviews = catchAsync(async (req, res) => {
  const result = await reviewServices.getAllReviewsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reviews retrieved successfully!",
    data: result,
  });
});

// ✅ Get single review
const getSingleReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await reviewServices.getSingleReviewFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review retrieved successfully!",
    data: result,
  });
});

// ✅ Get approved reviews for product
const getApprovedReviewsByProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await reviewServices.getApprovedReviewsForProduct(productId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Approved reviews retrieved successfully!",
    data: result,
  });
});

// ✅ Update review
const updateReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const updatedData: any = { ...req.body };

  // if (files?.photos?.length) {
  //   updatedData.photos = files.photos.map((f) => f.path);
  // }

  // Handle gallery images
  if (files["photos"]?.length) {
    const newPhotosImages = files["photos"].map((f) => f.path);
    // Merge with existing gallery images (if provided)
    updatedData.photos = Array.isArray(updatedData.photos)
      ? [...updatedData.photos, ...newPhotosImages]
      : newPhotosImages;
  } else if (updatedData.photos) {
    try {
      updatedData.photos = Array.isArray(updatedData.photos)
        ? updatedData.photos
        : JSON.parse(updatedData.photos);
    } catch {
      updatedData.photos = [updatedData.photos];
    }
  }

  const result = await reviewServices.updateReviewOnDB(id, updatedData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review updated successfully!",
    data: result,
  });
});

// ✅ Delete review
const deleteReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await reviewServices.deleteReviewFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review deleted successfully!",
    data: result,
  });
});

export const reviewControllers = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getApprovedReviewsByProduct,
};
