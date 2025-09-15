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
exports.attributeServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const http_status_1 = __importDefault(require("http-status"));
const attributes_model_1 = require("./attributes.model");
const attributes_consts_1 = require("./attributes.consts");
const getAllAttributesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const attributeQuery = new QueryBuilder_1.default(attributes_model_1.AttributesModel.find(), query)
        .search(attributes_consts_1.AttributeSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield attributeQuery.modelQuery;
    return result;
});
const getSingleAttributeFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = attributes_model_1.AttributesModel.findById(id);
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Attribute does not exists!");
    }
    return result;
});
const createAttributeIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isAttributeExists = yield attributes_model_1.AttributesModel.findOne({
        name: payload === null || payload === void 0 ? void 0 : payload.name,
    });
    if (isAttributeExists) {
        throw new handleAppError_1.default(http_status_1.default.CONFLICT, "Attribute already exists!");
    }
    payload.slug = payload === null || payload === void 0 ? void 0 : payload.name.split(" ").join("-");
    const result = yield attributes_model_1.AttributesModel.create(payload);
    return result;
});
exports.attributeServices = {
    getAllAttributesFromDB,
    getSingleAttributeFromDB,
    createAttributeIntoDB,
};
