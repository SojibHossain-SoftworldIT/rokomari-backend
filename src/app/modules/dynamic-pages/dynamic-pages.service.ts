import { TDynamicPage } from "./dynamic-pages.interface";
import { DynamicPageModel } from "./dynamic-pages.model";

const createDynamicPageOnDB = async (payload: TDynamicPage) => {
  const result = await DynamicPageModel.create(payload);
  return result;
};

const getAllDynamicPagesFromDB = async () => {
  const result = await DynamicPageModel.find().sort({ createdAt: -1 });
  return result;
};

const getDynamicPageByIdFromDB = async (id: string) => {
  const result = await DynamicPageModel.findById(id);
  return result;
};

const getDynamicPageBySlugFromDB = async (slug: string) => {
  const result = await DynamicPageModel.findOne({ slug, isActive: true });
  return result;
};

const updateDynamicPageOnDB = async (id: string, payload: Partial<TDynamicPage>) => {
  const result = await DynamicPageModel.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteDynamicPageFromDB = async (id: string) => {
  const result = await DynamicPageModel.findByIdAndDelete(id);
  return result;
};

export const dynamicPagesServices = {
  createDynamicPageOnDB,
  getAllDynamicPagesFromDB,
  getDynamicPageByIdFromDB,
  getDynamicPageBySlugFromDB,
  updateDynamicPageOnDB,
  deleteDynamicPageFromDB,
};