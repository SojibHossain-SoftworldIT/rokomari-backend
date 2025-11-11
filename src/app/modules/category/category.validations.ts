import { z } from "zod";

// export const iconSchema = z.object({
//   name: z.string({
//     error: (issue) =>
//       issue.input === undefined ? "Icon name is required!" : "Not a string!",
//   }),
//   url: z
//     .string({
//       error: (issue) =>
//         issue.input === undefined ? "Icon URL is required!" : "Not a string!",
//     })
//     .url("Invalid icon URL!"),
// });

export const createCategoryZodSchema = z.object({
  mainCategory: z.enum([
    "book",
    "electronics",
    "superstore",
    "kids-zone",
    "corporate-order",
    "best-seller-award",
    "offer",
    "just-for-you",
  ]),
  name: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Category name is required!"
        : "Not a string!",
  }),
  slug: z.string().optional(),
  details: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Category description is required!"
        : "Not a string!",
  }),
  // icon: iconSchema,
  // image: z
  //   .string({
  //     error: (issue) =>
  //       issue.input === undefined ? "Image is required!" : "Not a string!",
  //   })
  //   .url("Invalid image URL!"),
  image: z.string().optional(),
  // bannerImg: z
  //   .string({
  //     error: (issue) =>
  //       issue.input === undefined
  //         ? "Banner image is required!"
  //         : "Not a string!",
  //   })
  //   .url("Invalid banner image URL!"),
  bannerImg: z.string().optional(),
  feautured: z.boolean().optional(),
  subCategories: z.array(z.string()).default([]),
});
