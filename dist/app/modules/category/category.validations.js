"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategoryZodSchema = void 0;
const zod_1 = require("zod");
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
exports.createCategoryZodSchema = zod_1.z.object({
    mainCategory: zod_1.z.enum([
        "book",
        "electronics",
        "superstore",
        "kids-zone",
        "corporate-order",
        "best-seller-award",
        "offer",
        "just-for-you",
    ]),
    name: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "Category name is required!"
            : "Not a string!",
    }),
    slug: zod_1.z.string().optional(),
    details: zod_1.z.string({
        error: (issue) => issue.input === undefined
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
    image: zod_1.z.string().optional(),
    // bannerImg: z
    //   .string({
    //     error: (issue) =>
    //       issue.input === undefined
    //         ? "Banner image is required!"
    //         : "Not a string!",
    //   })
    //   .url("Invalid banner image URL!"),
    bannerImg: zod_1.z.string().optional(),
    feautured: zod_1.z.boolean().optional(),
    subCategories: zod_1.z.array(zod_1.z.string()).default([]),
});
