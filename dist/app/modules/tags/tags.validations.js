"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTagZodSchema = void 0;
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
exports.createTagZodSchema = zod_1.z.object({
    name: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "Tag name is required!" : "Not a string!",
    }),
    slug: zod_1.z.string().optional(),
    details: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "A short detail is required!"
            : "Not a string!",
    }),
    // icon: iconSchema,
    // image: z
    //   .string({
    //     error: (issue) =>
    //       issue.input === undefined ? "Image URL is required!" : "Not a string!",
    //   })
    //   .url("Invalid image URL!"),
    image: zod_1.z.string().optional(),
});
