import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import AppError from "../../errors/handleAppError";
import { TAuthor } from "./authors.interface";
import { AuthorModel } from "./authors.model";

// ✅ Create Author (with image upload)
const createAuthorIntoDB = async (authorData: TAuthor) => {
  const result = await AuthorModel.create(authorData);
  return result;
};

// ✅ Get All Authors
const getAuthorsFromDB = async (): Promise<TAuthor[]> => {
  return await AuthorModel.find();
};

// ✅ Get Single Author by ID
const getSingleAuthorFromDB = async (id: string): Promise<TAuthor | null> => {
  return await AuthorModel.findById(id);
};

// ✅ Update Author (supports image upload & follower count increment)
const updateAuthorInDB = async (
  id: string,
  updatedData: Partial<TAuthor>
): Promise<TAuthor | null> => {
  const author = await AuthorModel.findById(id);
  if (!author) throw new AppError(404, "Author not found!");

  // Handle image replacement
  if (updatedData.image && author.image && updatedData.image !== author.image) {
    await deleteImageFromCLoudinary(author.image);
  }

  // Handle follower increment (optional flag)
  if ((updatedData as any).increaseFollowers) {
    updatedData.followersCount = (author.followersCount || 0) + 1;
  }

  const updatedAuthor = await AuthorModel.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  );

  return updatedAuthor;
};

// ✅ Delete Author (and image from Cloudinary)
const deleteAuthorFromDB = async (id: string): Promise<TAuthor | null> => {
  const author = await AuthorModel.findByIdAndDelete(id);
  if (!author) throw new AppError(404, "Author not found!");

  if (author.image) {
    await deleteImageFromCLoudinary(author.image);
  }

  return author;
};

export const authorsServices = {
  createAuthorIntoDB,
  getAuthorsFromDB,
  getSingleAuthorFromDB,
  updateAuthorInDB,
  deleteAuthorFromDB,
};
