import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import AppError from "../../errors/handleAppError";
import { TSettings } from "./settings.interface";
import { SettingsModel } from "./settings.model";

// ✅ Create Settings
const createSettingsOnDB = async (payload: TSettings) => {
  const exist = await SettingsModel.findOne();
  if (exist)
    throw new AppError(400, "Settings already exist. Please update instead.");
  const result = await SettingsModel.create(payload);
  return result;
};

// ✅ Get Settings (Only one record)
const getSettingsFromDB = async () => {
  const result = await SettingsModel.findOne();
  return result;
};

// ✅ Update Settings
const updateSettingsOnDB = async (updatedData: Partial<TSettings>) => {
  const settings = await SettingsModel.findOne();
  if (!settings) throw new AppError(404, "Settings not found!");

  // Handle image deletions if needed
  if (
    (updatedData as any).deletedSliderImages?.length > 0 &&
    settings.sliderImages?.length
  ) {
    const restImages = settings.sliderImages.filter(
      (img) => !(updatedData as any).deletedSliderImages?.includes(img)
    );
    const updatedSliderImages = (updatedData.sliderImages || [])
      .filter((img) => !(updatedData as any).deletedSliderImages?.includes(img))
      .filter((img) => !restImages.includes(img));

    updatedData.sliderImages = [...restImages, ...updatedSliderImages];

    await Promise.all(
      (updatedData as any).deletedSliderImages.map((img: string) =>
        deleteImageFromCLoudinary(img)
      )
    );
  }

  const result = await SettingsModel.findOneAndUpdate({}, updatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const settingsServices = {
  createSettingsOnDB,
  getSettingsFromDB,
  updateSettingsOnDB,
};
