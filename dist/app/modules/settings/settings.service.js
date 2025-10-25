"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsServices = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const settings_model_1 = require("./settings.model");
// ✅ Create Settings
const createSettingsOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const exist = yield settings_model_1.SettingsModel.findOne();
    if (exist)
        throw new handleAppError_1.default(400, "Settings already exist. Please update instead.");
    const result = yield settings_model_1.SettingsModel.create(payload);
    return result;
});
// ✅ Get Settings (Only one record)
const getSettingsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield settings_model_1.SettingsModel.findOne();
    return result;
});
// ✅ Update Settings
const updateSettingsOnDB = (updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const settings = yield settings_model_1.SettingsModel.findOne();
    if (!settings)
        throw new handleAppError_1.default(404, "Settings not found!");
    // Handle image deletions if needed
    if (((_a = updatedData.deletedSliderImages) === null || _a === void 0 ? void 0 : _a.length) > 0 &&
        ((_b = settings.sliderImages) === null || _b === void 0 ? void 0 : _b.length)) {
        const restImages = settings.sliderImages.filter((img) => { var _a; return !((_a = updatedData.deletedSliderImages) === null || _a === void 0 ? void 0 : _a.includes(img)); });
        const updatedSliderImages = (updatedData.sliderImages || [])
            .filter((img) => { var _a; return !((_a = updatedData.deletedSliderImages) === null || _a === void 0 ? void 0 : _a.includes(img)); })
            .filter((img) => !restImages.includes(img));
        updatedData.sliderImages = [...restImages, ...updatedSliderImages];
        yield Promise.all(updatedData.deletedSliderImages.map((img) => (0, cloudinary_config_1.deleteImageFromCLoudinary)(img)));
    }
    const result = yield settings_model_1.SettingsModel.findOneAndUpdate({}, updatedData, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.settingsServices = {
    createSettingsOnDB,
    getSettingsFromDB,
    updateSettingsOnDB,
};
