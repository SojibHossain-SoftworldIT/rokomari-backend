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

export const createTagZodSchema = z.object({
  name: z.string({
    error: (issue) =>
      issue.input === undefined ? "Tag name is required!" : "Not a string!",
  }),
  slug: z.string().optional(),
  details: z.string({
    error: (issue) =>
      issue.input === undefined
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
  image: z.string().optional(),
});
