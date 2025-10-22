import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { brandServices } from "./brands.service";

/**
 * 🔹 Get all brands
 */
const getAllBrands = catchAsync(async (req, res) => {
  const result = await brandServices.getAllBrandsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Brands retrieved successfully!",
    data: result,
  });
});

/**
 * 🔹 Get single brand
 */
const getSingleBrand = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await brandServices.getSingleBrandFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Brand data retrieved successfully!",
    data: result,
  });
});

/**
 * 🔹 Create brand (accepts both files and JSON)
 */
const createBrand = catchAsync(async (req, res) => {
  const files =
    (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

  const brandData = {
    ...req.body,
    icon: {
      name: req.body.iconName || "",
      url: files["iconFile"]?.[0]?.path || req.body.iconUrl || "",
    },
    images: [],
  };

  // ✅ Handle images (array of layout + image)
  if (files["imagesFiles"]?.length) {
    brandData.images = files["imagesFiles"].map((file, index) => ({
      layout:
        (req.body[`images[${index}].layout`] as string) ||
        req.body.layout ||
        "grid",
      image: file.path,
    }));
  } else if (req.body.images) {
    // ✅ Handle JSON input for images
    try {
      brandData.images = Array.isArray(req.body.images)
        ? req.body.images
        : JSON.parse(req.body.images);
    } catch {
      brandData.images = [];
    }
  }

  const result = await brandServices.createBrandOnDB(brandData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Brand created successfully!",
    data: result,
  });
});

/**
 * 🔹 Update brand (accepts both files and JSON)
 */
const updateBrand = catchAsync(async (req, res) => {
  const { id } = req.params;
  const files =
    (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

  const updatedData: any = { ...req.body };

  // ✅ Update icon (prefer uploaded file)
  if (files["iconFile"]?.[0]?.path) {
    updatedData.icon = {
      name: req.body.iconName || "",
      url: files["iconFile"][0].path,
    };
  } else if (req.body.iconUrl || req.body.iconName) {
    updatedData.icon = {
      name: req.body.iconName || "",
      url: req.body.iconUrl || "",
    };
  }

  // ✅ Update images (either uploaded files or JSON)
  if (files["imagesFiles"]?.length) {
    updatedData.images = files["imagesFiles"].map((file, index) => ({
      layout:
        (req.body[`images[${index}].layout`] as string) ||
        req.body.layout ||
        "grid",
      image: file.path,
    }));
  } else if (req.body.images) {
    try {
      updatedData.images = Array.isArray(req.body.images)
        ? req.body.images
        : JSON.parse(req.body.images);
    } catch {
      updatedData.images = [];
    }
  }

  const result = await brandServices.updateBrandOnDB(id, updatedData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Brand updated successfully!",
    data: result,
  });
});

/**
 * 🔹 Delete brand
 */
const deleteBrand = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await brandServices.deleteBrandFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Brand deleted successfully!",
    data: result,
  });
});

export const brandsControllers = {
  getAllBrands,
  getSingleBrand,
  createBrand,
  updateBrand,
  deleteBrand,
};
