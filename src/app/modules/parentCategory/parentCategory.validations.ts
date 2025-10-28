// import { z } from "zod";

// // categoryAndTags validation
// const parentCategory = z.object({
//   name: z.string({ error: "Parent Category Name is Require" }),
//   categories: z.array(z.string()).min(1, "At least one category is required!"),
// });

import { z } from "zod";
import { Types } from "mongoose"; // <-- এটা যোগ করো

// Create Schema
const createParentCategoryZodSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Parent Category Name is required!" })
    .trim(),

  categories: z
    .array(
      z
        .string()
        .refine((val) => Types.ObjectId.isValid(val), {
          message: "Invalid Category ID",
        })
    )
    .min(1, { message: "At least one category is required!" }),
});

// Update Schema
const updateParentCategoryZodSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Parent Category Name is required!" })
    .trim()
    .optional(),

  categories: z
    .array(
      z
        .string()
        .refine((val) => Types.ObjectId.isValid(val), {
          message: "Invalid Category ID",
        })
    )
    .min(1, { message: "At least one category is required!" })
    .optional(),
});

export const parentCategoryValidation = {
  createParentCategoryZodSchema,
  updateParentCategoryZodSchema,
};
