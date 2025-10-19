import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import AppError from "../../errors/handleAppError";
import { TReview } from "./review.interface";
import { ReviewModel } from "./review.model";

// ✅ Create review
const createReviewOnDB = async (payload: TReview) => {
  const result = await ReviewModel.create(payload);
  return result;
};

// ✅ Get all reviews
const getAllReviewsFromDB = async () => {
  return ReviewModel.find()
    .populate("user", "name email")
    .populate("product", "description.name");
};

// ✅ Get single review by ID
const getSingleReviewFromDB = async (id: string) => {
  return ReviewModel.findById(id)
    .populate("user", "name email")
    .populate("product", "description.name");
};

// ✅ Get approved reviews for a specific product
const getApprovedReviewsForProduct = async (productId: string) => {
  return ReviewModel.find({ product: productId, status: "approved" })
    .populate("user", "name email")
    .sort({ createdAt: -1 });
};

// ✅ Update review
const updateReviewOnDB = async (id: string, updatedData: Partial<TReview>) => {
  const review = await ReviewModel.findById(id);
  if (!review) throw new AppError(404, "Review not found!");

  // Handle photo deletion if any
  if ((updatedData as any).deletedPhotos?.length > 0 && review.photos?.length) {
    const restPhotos = review.photos.filter(
      (img) => !(updatedData as any).deletedPhotos?.includes(img)
    );

    const updatedPhotos = (updatedData.photos || [])
      .filter((img) => !(updatedData as any).deletedPhotos?.includes(img))
      .filter((img) => !restPhotos.includes(img));

    updatedData.photos = [...restPhotos, ...updatedPhotos];

    await Promise.all(
      (updatedData as any).deletedPhotos.map((img: string) =>
        deleteImageFromCLoudinary(img)
      )
    );
  }

  const updatedReview = await ReviewModel.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  return updatedReview;
};

// ✅ Delete review
const deleteReviewFromDB = async (id: string) => {
  const review = await ReviewModel.findByIdAndDelete(id);
  if (!review) throw new AppError(404, "Review not found!");
  return review;
};

export const reviewServices = {
  createReviewOnDB,
  getAllReviewsFromDB,
  getSingleReviewFromDB,
  updateReviewOnDB,
  deleteReviewFromDB,
  getApprovedReviewsForProduct,
};
