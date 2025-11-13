// middlewares/parseFormData.ts
import { Request, Response, NextFunction } from "express";

export const parseFormData = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // JSON string ফিল্ডগুলা পার্স করে নেয়া
    if (req.body.subCategories && typeof req.body.subCategories === "string") {
      req.body.subCategories = JSON.parse(req.body.subCategories);
    }

    // যদি nested icon ও JSON আসে, সেটা পার্স করাও
    if (req.body.icon && typeof req.body.icon === "string") {
      req.body.icon = JSON.parse(req.body.icon);
    }

    next();
  } catch (err) {
    next(err);
  }
};
