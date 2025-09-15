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
exports.shopServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const http_status_1 = __importDefault(require("http-status"));
const shop_model_1 = require("./shop.model");
const shop_const_1 = require("./shop.const");
const vendor_model_1 = require("../vendor/vendor.model");
const getAllShopsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const shopQuery = new QueryBuilder_1.default(shop_model_1.ShopModel.find(), query)
        .search(shop_const_1.ShopSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield shopQuery.modelQuery
        .populate("vendorId")
        .populate("staffs")
        .populate("products")
        .populate("orders")
        .populate("transactions")
        .populate("withdrawals")
        .populate("attributes")
        .populate("coupons");
    return result;
});
const getSingleShopFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shop_model_1.ShopModel.findById(id)
        .populate("vendorId")
        .populate("staffs")
        .populate("products")
        .populate("orders")
        .populate("transactions")
        .populate("withdrawals")
        .populate("attributes")
        .populate("coupons");
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Shop does not exists!");
    }
    return result;
});
const createShopIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isVendorExists = yield vendor_model_1.VendorModel.findById(payload === null || payload === void 0 ? void 0 : payload.vendorId);
    if (!isVendorExists) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "User isn't a valid vendor!");
    }
    const result = yield shop_model_1.ShopModel.create(payload);
    return result;
});
exports.shopServices = {
    getAllShopsFromDB,
    getSingleShopFromDB,
    createShopIntoDB,
};
