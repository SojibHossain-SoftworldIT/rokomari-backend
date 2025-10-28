// import { Types } from "mongoose";
// import QueryBuilder from "../../builder/QueryBuilder";
// import { TParentCategory } from "./parentCategory.interface";
// import { parentCategoryModel } from "./parentCategory.model";

// // Create Parent Category
// const createParentCategoryInDB = async (payload: TParentCategory) => {
//   // Check if name already exists
//   const existing = await parentCategoryModel.findOne({ name: payload.name });
//   if (existing) {
//     throw new Error("Parent Category with this name already exists!");
//   }

//   const result = await parentCategoryModel.create(payload);
//   return result;
// };

// // Get All Parent Categories with populated categories
// const getAllParentCategoriesFromDB = async (query: Record<string, unknown>) => {
//   const parentCategoryQuery = new QueryBuilder(
//     parentCategoryModel.find().populate("categories"),
//     query
//   )
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const result = await parentCategoryQuery.modelQuery;
//   return result;
// };

// // Get Single Parent Category
// const getSingleParentCategoryFromDB = async (id: string) => {
//   const result = await parentCategoryModel.findById(id).populate("categories");
//   return result;
// };

// // Update Parent Category
// const updateParentCategoryInDB = async (
//   id: string,
//   payload: Partial<TParentCategory>
// ) => {
//   // If name is being updated, check uniqueness
//   if (payload.name) {
//     const existing = await parentCategoryModel.findOne({
//       name: payload.name,
//       _id: { $ne: id },
//     });
//     if (existing) {
//       throw new Error("Another Parent Category with this name already exists!");
//     }
//   }

//   const result = await parentCategoryModel
//     .findByIdAndUpdate(id, payload, {
//       new: true,
//       runValidators: true,
//     })
//     .populate("categories");

//   return result;
// };

// export const parentCategoryServices = {
//   createParentCategoryInDB,
//   getAllParentCategoriesFromDB,
//   getSingleParentCategoryFromDB,
//   updateParentCategoryInDB,
// };

// parentCategory.service.ts
import QueryBuilder from "../../builder/QueryBuilder";
import { TParentCategory } from "./parentCategory.interface";
import { parentCategoryModel } from "./parentCategory.model";
import { ParentCategorySearchableFields } from "./parentCategory.consts";

// Create Parent Category
const createParentCategoryInDB = async (payload: TParentCategory) => {
  // Check if name already exists
  const existing = await parentCategoryModel.findOne({ name: payload.name });
  if (existing) {
    throw new Error("Parent Category with this name already exists!");
  }

  const result = await parentCategoryModel.create(payload);
  return await result.populate("categories");
};

// Get All Parent Categories (with search, filter, pagination)
const getAllParentCategoriesFromDB = async (query: Record<string, unknown>) => {
  const parentCategoryQuery = new QueryBuilder(
    parentCategoryModel.find().populate("categories"),
    query
  )
    .search(ParentCategorySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await parentCategoryQuery.modelQuery;
  const meta = await parentCategoryQuery.countTotal();

  return {
    meta,
    result,
  };
};

// Get Single Parent Category
const getSingleParentCategoryFromDB = async (id: string) => {
  const result = await parentCategoryModel.findById(id).populate("categories");

  if (!result) {
    throw new Error("Parent Category not found!");
  }

  return result;
};

// Update Parent Category
const updateParentCategoryInDB = async (
  id: string,
  payload: Partial<TParentCategory>
) => {
  // Check if name is being updated and already exists
  if (payload.name) {
    const existing = await parentCategoryModel.findOne({
      name: payload.name,
      _id: { $ne: id },
    });
    if (existing) {
      throw new Error("Another Parent Category with this name already exists!");
    }
  }

  const result = await parentCategoryModel
    .findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    })
    .populate("categories");

  if (!result) {
    throw new Error("Parent Category not found!");
  }

  return result;
};

// Delete Parent Category (Hard Delete - Permanent)
const deleteParentCategoryFromDB = async (id: string) => {
  const result = await parentCategoryModel.findByIdAndDelete(id);

  if (!result) {
    throw new Error("Parent Category not found!");
  }

  return result;
};

export const parentCategoryServices = {
  createParentCategoryInDB,
  getAllParentCategoriesFromDB,
  getSingleParentCategoryFromDB,
  updateParentCategoryInDB,
  deleteParentCategoryFromDB,
};
