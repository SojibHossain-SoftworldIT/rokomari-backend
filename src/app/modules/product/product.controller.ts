import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { productServices } from "./product.service";

const getAllProduct = catchAsync(async (req, res) => {
  const result = await productServices.getAllProductFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Products retrieve successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getProductsByCategoryandTag = catchAsync(async (req, res) => {
  const { category, tag } = req.query;

  const result = await productServices.getProductsByCategoryandTag(
    category as string,
    tag as string
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Products retrieve successfully!",
    data: result,
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await productServices.getSingleProductFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product retrieve successfully!",
    data: result,
  });
});

// const createProduct = catchAsync(async (req, res) => {
//   const files = req.files as {
//     [fieldname: string]: Express.Multer.File[];
//   };

//   const productData = {
//     ...req.body,
//     featuredImg: files["featuredImgFile"]?.[0]?.path || "",
//     gallery: files["galleryImagesFiles"]
//       ? files["galleryImagesFiles"].map((f) => f.path)
//       : [],
//   };

//   const result = await productServices.createProductOnDB(productData);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.CREATED,
//     message: "Product created successfully!",
//     data: result,
//   });
// });

const createProduct = catchAsync(async (req, res) => {
  const files =
    (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

  const productData = {
    ...req.body,
    featuredImg:
      files["featuredImgFile"]?.[0]?.path || req.body.featuredImg || "",
    gallery: files["galleryImagesFiles"]
      ? files["galleryImagesFiles"].map((f) => f.path)
      : req.body.gallery || [],
    previewImg: files["previewImgFile"]
      ? files["previewImgFile"].map((f) => f.path)
      : req.body.previewImg || [],
  };

  // ✅ Handle author images dynamically
  // if (req.body.bookInfo?.specification?.authors) {
  //   productData.bookInfo.specification.authors =
  //     req.body.bookInfo?.specification?.authors.map(
  //       (author: any, index: number) => ({
  //         ...author,
  //         image: files[`authorImage_${index}`]?.[0]?.path || author.image || "",
  //       })
  //     );
  // }

  const result = await productServices.createProductOnDB(productData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Product created successfully!",
    data: result,
  });
});

// const updateProduct = catchAsync(async (req, res) => {
//   const { id } = req.params;

//   const files = req.files as {
//     [fieldname: string]: Express.Multer.File[];
//   };

//   const updatedData: any = {
//     ...req.body,
//   };

//   if (files["featuredImgFile"]?.[0]?.path) {
//     updatedData.featuredImg = files["featuredImgFile"][0].path;
//   }

//   if (files["galleryImagesFiles"]?.length) {
//     updatedData.gallery = files["galleryImagesFiles"].map((f) => f.path);
//   }
//   if (files["previewImgFile"]?.length) {
//     updatedData.previewImg = files["previewImgFile"].map((f) => f.path);
//   }

//   const result = await productServices.updateProductOnDB(id, updatedData);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Product updated successfully!",
//     data: result,
//   });
// });

// Product delete controller

const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;

  const files =
    (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

  const updatedData: any = {
    ...req.body,
  };

  // ✅ Safely handle featured image
  if (files["featuredImgFile"]?.[0]?.path) {
    updatedData.featuredImg = files["featuredImgFile"][0].path;
  } else if (req.body.featuredImg) {
    updatedData.featuredImg = req.body.featuredImg;
  }

  // ✅ Safely handle gallery
  // if (files["galleryImagesFiles"]?.length) {
  //   updatedData.gallery = files["galleryImagesFiles"].map((f) => f.path);
  // } else if (req.body.gallery) {
  //   // Handle JSON array (stringified or real array)
  //   try {
  //     updatedData.gallery = Array.isArray(req.body.gallery)
  //       ? req.body.gallery
  //       : JSON.parse(req.body.gallery);
  //   } catch {
  //     updatedData.gallery = [req.body.gallery];
  //   }
  // }

  // // ✅ Safely handle preview images
  // if (files["previewImgFile"]?.length) {
  //   updatedData.previewImg = files["previewImgFile"].map((f) => f.path);
  // } else if (req.body.previewImg) {
  //   try {
  //     updatedData.previewImg = Array.isArray(req.body.previewImg)
  //       ? req.body.previewImg
  //       : JSON.parse(req.body.previewImg);
  //   } catch {
  //     updatedData.previewImg = [req.body.previewImg];
  //   }
  // }

  // // ✅ Handle author images update
  // if (updatedData.bookInfo?.specification?.authors) {
  //   updatedData.bookInfo.specification.authors =
  //     updatedData.bookInfo.specification.authors.map(
  //       (author: any, index: number) => ({
  //         ...author,
  //         image: files[`authorImage_${index}`]?.[0]?.path || author.image || "",
  //       })
  //     );
  // }

  // Handle gallery images
  if (files["galleryImagesFiles"]?.length) {
    const newGalleryImages = files["galleryImagesFiles"].map((f) => f.path);
    // Merge with existing gallery images (if provided)
    updatedData.gallery = Array.isArray(updatedData.gallery)
      ? [...updatedData.gallery, ...newGalleryImages]
      : newGalleryImages;
  } else if (updatedData.gallery) {
    try {
      updatedData.gallery = Array.isArray(updatedData.gallery)
        ? updatedData.gallery
        : JSON.parse(updatedData.gallery);
    } catch {
      updatedData.gallery = [updatedData.gallery];
    }
  }

  // Handle preview images
  if (files["previewImgFile"]?.length) {
    const newPreviewImages = files["previewImgFile"].map((f) => f.path);
    // Merge with existing preview images (if provided)
    updatedData.previewImg = Array.isArray(updatedData.previewImg)
      ? [...updatedData.previewImg, ...newPreviewImages]
      : newPreviewImages;
  } else if (updatedData.previewImg) {
    try {
      updatedData.previewImg = Array.isArray(updatedData.previewImg)
        ? updatedData.previewImg
        : JSON.parse(updatedData.previewImg);
    } catch {
      updatedData.previewImg = [updatedData.previewImg];
    }
  }

  const result = await productServices.updateProductOnDB(id, updatedData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product updated successfully!",
    data: result,
  });
});

const deleteSingleProduct = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await productServices.deleteSingleProductOnDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product deleted successfully!",
    data: result,
  });
});

const searchProducts = catchAsync(async (req, res) => {
  const { q } = req.query;

  const result = await productServices.searchProductsFromDB(q as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.length
      ? "Products retrieved successfully!"
      : "No products found!",
    data: result,
  });
});

const getProductsByAuthor = catchAsync(async (req, res) => {
  const { authorId } = req.params;
  const result = await productServices.getProductsByAuthorFromDB(authorId, req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Products by author retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

export const productControllers = {
  createProduct,
  getSingleProduct,
  deleteSingleProduct,
  searchProducts,
  getAllProduct,
  updateProduct,
  getProductsByCategoryandTag,
  getProductsByAuthor,
};
