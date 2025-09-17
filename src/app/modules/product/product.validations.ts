import { z } from "zod";

// brandAndCategories validation
const brandAndCategoryZodSchema = z.object({
  brand: z.string({
    error: () => "Brand ID is required!",
  }),
  categories: z
    .array(z.string({ error: () => "Category ID must be a string!" }))
    .min(1, { message: "At least one category is required!" }),
  tags: z
    .array(z.string({ error: () => "Tag ID must be a string!" }))
    .min(1, { message: "At least one tag is required!" }),
});

// description validation
const descriptionZodSchema = z.object({
  name: z.string({
    error: () => "Name is required!",
  }),
  slug: z.string().optional(),
  unit: z.string({
    error: () => "Unit is required!",
  }),
  description: z.string({
    error: () => "A small description is required!",
  }),
  status: z.enum(["publish", "draft"], { message: "Custom error message" }),
});

// external product validation
const externalZodSchema = z.object({
  productUrl: z.string().optional(),
  buttonLabel: z.string().optional(),
});

// productInfo validation
const productInfoZodSchema = z.object({
  price: z.number({
    error: () => "Price is required!",
  }),
  salePrice: z.number({
    error: () => "Sale price is required!",
  }),
  quantity: z.number({
    error: () => "Quantity is required!",
  }),
  sku: z.string({
    error: () => "SKU is required!",
  }),
  width: z.string({
    error: () => "Width is required!",
  }),
  height: z.string({
    error: () => "Height is required!",
  }),
  length: z.string({
    error: () => "Length is required!",
  }),
  isDigital: z.boolean().optional(),
  digital: z.string().optional(),
  isExternal: z.boolean().optional(),
  external: externalZodSchema.optional(),
  status: z.enum(["draft", "publish", "low-quantity"], {
    message: "Status must be 'draft', 'publish', or 'low-quantity'",
  }),
});

// Main Product Validation
export const createProductZodSchema = z.object({
  shopId: z.string({
    error: () => "Shop ID is required!",
  }),
  video: z.string().optional(),
  brandAndCategories: brandAndCategoryZodSchema,
  description: descriptionZodSchema,
  productType: z.enum(["simple", "variable"], {
    message: "Product type must be 'simple' or 'variable'",
  }),
  productInfo: productInfoZodSchema,
});



const authorZodSchema = z.object({
  name: z.string(),
  image: z.string().url('Invalid author image URL!').optional(),
  description: z.string().optional(),
});

const specificationZodSchema = z.object({
  title: z.string(),
  author: authorZodSchema,
  publisher: z.string(),
  edition: z.string().optional(),
  numberOfPages: z.number().optional(),
  country: z.string().optional(),
  language: z.string().optional(),
});

export const bookInfoZodSchema = z.object({
  specification: specificationZodSchema,
  format: z.enum(['hardcover', 'paperback', 'ebook', 'audiobook']).optional(),
  genre: z.array(z.string()).optional(),
  pages: z.number().optional(),
  isbn: z.string().optional(),
});

export const updateProductZodSchema = z.object({
  shopId: z.string().optional(),
  featuredImg: z.string().url('Invalid feature image URL!').optional(),
  gallery: z
    .array(z.string().url('Invalid gallery image URL!'))
    .min(1, { message: 'At least one gallery image is required!' })
    .optional(),
  video: z.string().optional(),
  brandAndCategories: brandAndCategoryZodSchema.optional(),
  description: descriptionZodSchema.optional(),
  productType: z
    .enum(['simple', 'variable'], {
      message: "Product type must be 'simple' or 'variable'",
    })
    .optional(),
  productInfo: productInfoZodSchema.optional(),
  deletedImages: z.array(z.string()).optional(),
  bookInfo: bookInfoZodSchema.optional(),
});
