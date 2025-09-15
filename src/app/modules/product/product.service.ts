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
      .populate("brandAndCategories.brand")
      .populate("brandAndCategories.categories")
      .populate("brandAndCategories.tags"),
    query
  )
    .search(ProductSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;
  return result;
};

const getProductsByCategoryandTag = async (category: string, tag: string) => {
  const categories = category ? (category as string).split(",") : [];

  const tags = tag ? (tag as string).split(",") : [];

  const products = await ProductModel.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "brandAndCategories.categories",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    {
      $lookup: {
        from: "tags",
        localField: "brandAndCategories.tags",
        foreignField: "_id",
        as: "tagDetails",
      },
    },
    {
      $lookup: {
        from: "brands",
        localField: "brandAndCategories.brand",
        foreignField: "_id",
        as: "brandDetails",
      },
    },
    {
      $addFields: {
        brandAndCategories: {
          brand: { $arrayElemAt: ["$brandDetails", 0] },
          categories: "$categoryDetails",
          tags: "$tagDetails",
        },
      },
    },
    {
      $match: {
        "description.status": "publish",
        ...(categories.length
          ? { "brandAndCategories.categories.name": { $in: categories } }
          : {}),
        ...(tags.length
          ? { "brandAndCategories.tags.name": { $in: tags } }
          : {}),
      },
    },
    {
      $project: {
        categoryDetails: 0,
        tagDetails: 0,
        brandDetails: 0,
      },
    },
  ]);

  return products;
};

const getSingleProductFromDB = async (id: string) => {
  const result = await ProductModel.findById(id)
    .populate("brandAndCategories.brand")
    .populate("brandAndCategories.categories")
    .populate("brandAndCategories.tags");
  return result;
};

const updateProductOnDB = async (
  id: string,
  updatedData: Partial<TProduct>
) => {
  const isProductExist = await ProductModel.findById(id);
  if (!isProductExist) {
    throw new AppError(404, "Product not found!");
  }

  if (
    updatedData.deletedImages &&
    updatedData.deletedImages.length > 0 &&
    isProductExist.gallery &&
    isProductExist.gallery.length > 0
  ) {
    const restDBImages = isProductExist.gallery.filter(
      (imageurl) => !updatedData.deletedImages?.includes(imageurl)
    );

    const updatedGalleryImages = (updatedData.gallery || [])
      .filter((imageurl) => !updatedData.deletedImages?.includes(imageurl))
      .filter((imageurl) => !restDBImages.includes(imageurl));

    updatedData.gallery = [...restDBImages, ...updatedGalleryImages];
  }

  const updatedProduct = await ProductModel.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  );

  // delete images from cloudinary if they are deleted
  if (updatedData.deletedImages && updatedData.deletedImages.length > 0) {
    await Promise.all(
      updatedData.deletedImages.map((imageurl) =>
        deleteImageFromCLoudinary(imageurl)
      )
    );
  }

  if (updatedData.featuredImg && isProductExist.featuredImg) {
    await deleteImageFromCLoudinary(isProductExist.featuredImg);
  }

  return updatedProduct;
};

// const getProductOfSpecificShop = async (
//   id: string,
//   query: Record<string, unknown>
// ) => {
//   const productQuery = new QueryBuilder(
//     ProductModel.find({ shopId: id })
//       .populate("brandAndCategories.brand")
//       .populate("brandAndCategories.categories")
//       .populate("brandAndCategories.tags"),
//     query
//   )
//     .search(ProductSearchableFields)
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const result = await productQuery.modelQuery;
//   return result;
// };

export const productServices = {
  createProductOnDB,
  getSingleProductFromDB,
  getAllProductFromDB,
  updateProductOnDB,
  getProductsByCategoryandTag,
};
