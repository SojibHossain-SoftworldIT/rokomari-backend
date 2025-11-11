// import { z } from "zod";

// // categoryAndTags validation
// const categoryAndTagsZodSchema = z.object({
//   publisher: z.string({ error: "Publisher ID is required!" }),
//   categories: z.array(z.string()).min(1, "At least one category is required!"),
//   tags: z.array(z.string()).min(1, "At least one tag is required!"),
// });

// // description validation
// const descriptionZodSchema = z.object({
//   name: z.string({ error: "Name is required!" }),
//   slug: z.string().optional(),
//   description: z.string({ error: "Description is required!" }),
//   status: z.enum(["publish", "draft"]),
//   name_bn: z.string().optional(),
//   description_bn: z.string().optional(),
//   metaTitle: z.string().optional(),
//   metaDescription: z.string().optional(),
//   keywords: z.array(z.string()).optional(),
// });

// // external product validation
// const externalZodSchema = z.object({
//   productUrl: z.string().url().optional(),
//   buttonLabel: z.string().optional(),
// });

// // productInfo validation
// const productInfoZodSchema = z.object({
//   price: z.number({ error: "Price is required!" }),
//   brand: z.string().optional(),
//   salePrice: z.number().optional(),
//   quantity: z.number({ error: "Quantity is required!" }),
//   sku: z.string({ error: "SKU is required!" }),
//   weight: z.string().optional(),
//   dimensions: z
//     .object({
//       width: z.string().optional(),
//       height: z.string().optional(),
//       length: z.string().optional(),
//     })
//     .optional(),
//   isDigital: z.boolean().optional(),
//   digital: z.string().optional(),
//   isExternal: z.boolean().optional(),
//   external: externalZodSchema.optional(),
//   discount: z.number().optional(),
//   totalDiscount: z.number().optional(),
//   status: z.enum(["draft", "publish", "low-quantity", "out-of-stock"]),
//   publicationDate: z.string().optional(),
//   isOnSale: z.boolean().optional(),
//   campaign: z.string().optional(),
// });

// // author validation
// // const authorZodSchema = z.object({
// //   name: z.string({ error: "Author name is required!" }),
// //   image: z.string().optional(),
// //   description: z.string().optional(),
// // });

// // specification validation
// const specificationZodSchema = z.object({
//   authors: z.array(z.string()).min(1, "At least one author is required!"),
//   publisher: z.string({ error: "Publisher is required!" }),
//   edition: z.string().optional(),
//   editionYear: z.number().optional(),
//   numberOfPages: z.number({ error: "Number of pages is required!" }),
//   country: z.string({ error: "Country is required!" }),
//   language: z.string({ error: "Language is required!" }),
//   isbn: z.string().optional(),
//   binding: z.preprocess(
//     (val) => (typeof val === "string" ? val.toLowerCase() : val),
//     z.enum(["hardcover", "paperback"]).optional()
//   ),
// });

// // bookInfo validation
// export const bookInfoZodSchema = z.object({
//   specification: specificationZodSchema,
//   format: z.enum(["hardcover", "paperback", "ebook", "audiobook"]).optional(),
//   genre: z.array(z.string()).optional(),
//   series: z.string().optional(),
//   translator: z.string().optional(),
// });

// // Create product
// export const createProductZodSchema = z.object({
//   featuredImg: z.string().optional(),
//   gallery: z.array(z.string()).optional(),
//   video: z.string().optional(),
//   categoryAndTags: categoryAndTagsZodSchema,
//   description: descriptionZodSchema,
//   productType: z.enum(["simple", "variable"]),
//   productInfo: productInfoZodSchema,
//   bookInfo: bookInfoZodSchema,
// });

// // Update product
// export const updateProductZodSchema = createProductZodSchema.partial().extend({
//   deletedImages: z.array(z.string()).optional(),
// });

import { z } from "zod";

export const createProductZodSchema = z.object({
  featuredImg: z.string(),
  previewImg: z.array(z.string()).optional(),
  gallery: z.array(z.string()).optional(),
  video: z.string().optional(),

  categoryAndTags: z.object({
    categories: z.array(z.string()),
    subCategories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  }),

  description: z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    status: z.enum(["publish", "draft"]).optional(),
  }),

  productType: z.enum(["simple", "variable"]),
  productInfo: z.object({
    productTitle: z.string(),
    price: z.number(),
    salePrice: z.number().optional(),
    quantity: z.number(),
    sku: z.string(),
  }),

  // ✅ Optional
  bookInfo: z
    .object({
      specification: z
        .object({
          authors: z.array(z.string()).optional(),
          publisher: z.string().optional(),
          numberOfPages: z.number().optional(),
          country: z.string().optional(),
          language: z.string().optional(),
        })
        .optional(),
      format: z
        .enum(["hardcover", "paperback", "ebook", "audiobook"])
        .optional(),
    })
    .optional(),
});

// Update product
export const updateProductZodSchema = createProductZodSchema.partial().extend({
  deletedImages: z.array(z.string()).optional(),
});
