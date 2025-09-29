import QueryBuilder from "../../builder/QueryBuilder";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import AppError from "../../errors/handleAppError";
import { ProductSearchableFields } from "./product.const";
import { TProduct } from "./product.interface";
import { ProductModel } from "./product.model";

const createProductOnDB = async (payload: TProduct) => {
  const result = await ProductModel.create(payload);
  return result;
};

const getAllProductFromDB = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(
    ProductModel.find()
      .populate("categoryAndTags.publisher")
      .populate("categoryAndTags.categories")
      .populate("categoryAndTags.tags"),
    query
  )
    .search(ProductSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  return await productQuery.modelQuery;
};

const getProductsByCategoryandTag = async (category: string, tag: string) => {
  const categories = category ? category.split(",") : [];
  const tags = tag ? tag.split(",") : [];

  return ProductModel.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "categoryAndTags.categories",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    {
      $lookup: {
        from: "tags",
        localField: "categoryAndTags.tags",
        foreignField: "_id",
        as: "tagDetails",
      },
    },
    {
      $lookup: {
        from: "publishers",
        localField: "categoryAndTags.publisher",
        foreignField: "_id",
        as: "publisherDetails",
      },
    },
    {
      $addFields: {
        categoryAndTags: {
          publisher: { $arrayElemAt: ["$publisherDetails", 0] },
          categories: "$categoryDetails",
          tags: "$tagDetails",
        },
      },
    },
    {
      $match: {
        "description.status": "publish",
        ...(categories.length
          ? { "categoryAndTags.categories.name": { $in: categories } }
          : {}),
        ...(tags.length ? { "categoryAndTags.tags.name": { $in: tags } } : {}),
      },
    },
    {
      $project: {
        categoryDetails: 0,
        tagDetails: 0,
        publisherDetails: 0,
      },
    },
  ]);
};

const getSingleProductFromDB = async (id: string) => {
  return ProductModel.findById(id)
    .populate("categoryAndTags.publisher")
    .populate("categoryAndTags.categories")
    .populate("categoryAndTags.tags");
};

const updateProductOnDB = async (
  id: string,
  updatedData: Partial<TProduct>
) => {
  const isProductExist = await ProductModel.findById(id);
  if (!isProductExist) {
    throw new AppError(404, "Product not found!");
  }

  // handle gallery update with deletedImages
  if (
    (updatedData as any).deletedImages &&
    (updatedData as any).deletedImages.length > 0 &&
    isProductExist.gallery?.length
  ) {
    const restDBImages = isProductExist.gallery.filter(
      (img) => !(updatedData as any).deletedImages?.includes(img)
    );

    const updatedGalleryImages = (updatedData.gallery || [])
      .filter((img) => !(updatedData as any).deletedImages?.includes(img))
      .filter((img) => !restDBImages.includes(img));

    updatedData.gallery = [...restDBImages, ...updatedGalleryImages];
  }

  const updatedProduct = await ProductModel.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  );

  // delete images from cloudinary
  if ((updatedData as any).deletedImages?.length > 0) {
    await Promise.all(
      (updatedData as any).deletedImages.map((img: string) =>
        deleteImageFromCLoudinary(img)
      )
    );
  }

  if (updatedData.featuredImg && isProductExist.featuredImg) {
    await deleteImageFromCLoudinary(isProductExist.featuredImg);
  }

  return updatedProduct;
};

// delete product from database

const deleteSingleProductOnDB = async (id: string) => {
  const product = await ProductModel.findByIdAndDelete(id);
  if (!product) {
    throw new AppError(404, "Product not found!");
  }
};

// search products
const searchProductsFromDB = async (query: string) => {
  if (!query) return [];

  // Exact match query
  const exactMatch = await ProductModel.find({
    $or: [
      { "description.name": query },
      { "description.slug": query },
      { "productInfo.sku": query },
      { "bookInfo.specification.isbn": query },
    ],
  })
    .limit(10)
    .populate("categoryAndTags.categories")
    .populate("categoryAndTags.tags")
    .populate("categoryAndTags.publisher");

  if (exactMatch.length > 0) return exactMatch;

  // Partial match (case-insensitive)
  const partialMatch = await ProductModel.find({
    $or: [
      { "description.name": { $regex: query, $options: "i" } },
      { "description.slug": { $regex: query, $options: "i" } },
      { "description.description": { $regex: query, $options: "i" } },
      {
        "bookInfo.specification.authors.name": { $regex: query, $options: "i" },
      },
      { "bookInfo.specification.publisher": { $regex: query, $options: "i" } },
      { "bookInfo.specification.language": { $regex: query, $options: "i" } },
      { "bookInfo.genre": { $regex: query, $options: "i" } },
    ],
  })
    .limit(10)
    .populate("categoryAndTags.categories")
    .populate("categoryAndTags.tags")
    .populate("categoryAndTags.publisher");

  return partialMatch;
};

export const productServices = {
  createProductOnDB,
  getAllProductFromDB,
  deleteSingleProductOnDB,
  searchProductsFromDB,
  getProductsByCategoryandTag,
  getSingleProductFromDB,
  updateProductOnDB,
};
