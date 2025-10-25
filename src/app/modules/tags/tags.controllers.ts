import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { tagServices } from "./tags.services";

const getAllTags = catchAsync(async (req, res) => {
  const result = await tagServices.getAllTagsFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tags retrieved successfully!",
    data: result,
  });
});

const getSingleTag = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await tagServices.getSingleTagFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tag retrieved successfully!",
    data: result,
  });
});

// const createTag = catchAsync(async (req, res) => {
//   const files =
//     (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

//   const tagData = {
//     ...req.body,
//     image: files["imageFile"]?.[0]?.path || req.body.image || "",
//   };

//   const result = await tagServices.createTagOnDB(tagData);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.CREATED,
//     message: "Tag created successfully!",
//     data: result,
//   });
// });

// const updateTag = catchAsync(async (req, res) => {
//   const id = req.params.id;
//   const files =
//     (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

//   const updatedData: any = { ...req.body };
//   if (files["imageFile"]?.[0]?.path) {
//     updatedData.image = files["imageFile"][0].path;
//   }

//   const result = await tagServices.updateTagInDB(id, updatedData);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Tag updated successfully!",
//     data: result,
//   });
// });

const createTag = catchAsync(async (req, res) => {
  const files =
    (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

  const tagData = {
    ...req.body,
    image: files["imageFile"]?.[0]?.path || req.body.image || "",
    icon: {
      name: req.body.iconName || "",
      url: files["iconFile"]?.[0]?.path || req.body.iconUrl || "",
    },
  };

  const result = await tagServices.createTagOnDB(tagData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Tag created successfully!",
    data: result,
  });
});

// const updateTag = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const files =
//     (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

//   const updatedData: any = { ...req.body };

//   if (files["imageFile"]?.[0]?.path) {
//     updatedData.image = files["imageFile"][0].path;
//   }

//   if (files["iconFile"]?.[0]?.path) {
//     updatedData.icon = {
//       name: req.body.iconName || "",
//       url: files["iconFile"][0].path,
//     };
//   }

//   const result = await tagServices.updateTagInDB(id, updatedData);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Tag updated successfully!",
//     data: result,
//   });
// });

const updateTag = catchAsync(async (req, res) => {
  const { id } = req.params;
  const files =
    (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

  const updatedData: any = { ...req.body };

  if (files["imageFile"]?.[0]?.path) {
    updatedData.image = files["imageFile"][0].path;
  } else if (req.body.imageFile) {
    updatedData.image = req.body?.imageFile;
  }

  if (files["iconFile"]?.[0]?.path) {
    updatedData.icon = {
      name: req.body.iconName || "",
      url: files["iconFile"][0].path,
    };
  } else if (req.body.iconFile || req.body.iconName) {
    updatedData.icon = {
      name: req.body.iconName || "",
      url: req.body.iconFile || "",
    };
  }

  const result = await tagServices.updateTagInDB(id, updatedData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tag updated successfully!",
    data: result,
  });
});

const deleteTag = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await tagServices.deleteTagFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tag deleted successfully!",
    data: result,
  });
});

export const tagControllers = {
  getAllTags,
  getSingleTag,
  createTag,
  updateTag,
  deleteTag,
};
