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
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawalServices = void 0;
const withdrawals_model_1 = require("./withdrawals.model");
const createWithdrawalOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdrawals_model_1.WithdrawalModel.create(payload);
    return result;
});
const getWithdrawalsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdrawals_model_1.WithdrawalModel.find().populate("shopId");
    return result;
});
const getSingleWithdrawalFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdrawals_model_1.WithdrawalModel.findById(id).populate("shopId");
    return result;
});
const updateWithdrawalOnDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdrawals_model_1.WithdrawalModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteWithdrawalFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdrawals_model_1.WithdrawalModel.findByIdAndDelete(id);
    return result;
});
exports.withdrawalServices = {
    createWithdrawalOnDB,
    getWithdrawalsFromDB,
    getSingleWithdrawalFromDB,
    updateWithdrawalOnDB,
    deleteWithdrawalFromDB,
};
