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
exports.AuthServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const user_model_1 = require("../user/user.model");
// Helper to generate tokens
const generateTokens = (payload) => {
    const accessToken = jsonwebtoken_1.default.sign(payload, config_1.default.jwt_access_secret, {
        expiresIn: "15m", // shorter-lived
    });
    const refreshToken = jsonwebtoken_1.default.sign(payload, config_1.default.jwt_refresh_secret, {
        expiresIn: "7d", // longer-lived
    });
    return { accessToken, refreshToken };
};
// Register a user in database
const registerUserOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.UserModel.create(payload);
    return result;
});
// Login with credentials
const loginUserFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.UserModel.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    if (!isUserExists) {
        throw Error("User does not exists!");
    }
    // check password
    const isPasswordMatched = yield bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.password, isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.password);
    if (!isPasswordMatched) {
        throw new handleAppError_1.default(http_status_1.default.UNAUTHORIZED, "Wrong Credentials!");
    }
    const user = yield user_model_1.UserModel.findByIdAndUpdate(isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists._id, { status: "active" }, { new: true });
    const jwtPayload = {
        email: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.email,
        role: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.role,
    };
    const { accessToken, refreshToken } = generateTokens(jwtPayload);
    return { user, accessToken, refreshToken };
});
// Login with provider
const loginUserUsingProviderFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield user_model_1.UserModel.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    if (!user) {
        user = yield user_model_1.UserModel.create(payload);
    }
    else {
        user = yield user_model_1.UserModel.findByIdAndUpdate(user._id, { status: "active" }, { new: true });
    }
    const jwtPayload = {
        email: user === null || user === void 0 ? void 0 : user.email,
        role: user === null || user === void 0 ? void 0 : user.role,
    };
    const { accessToken, refreshToken } = generateTokens(jwtPayload);
    return { user, accessToken, refreshToken };
});
// Refresh token
const refreshAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.default.jwt_refresh_secret);
        const jwtPayload = {
            email: decoded.email,
            role: decoded.role,
        };
        const accessToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, { expiresIn: "15m" });
        return { accessToken };
    }
    catch (error) {
        throw new handleAppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid or expired refresh token");
    }
});
// Logout
const logoutUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_model_1.UserModel.findByIdAndUpdate(id, { status: "inActive" }, { new: true });
    return {};
});
exports.AuthServices = {
    registerUserOnDB,
    loginUserFromDB,
    loginUserUsingProviderFromDB,
    refreshAccessToken,
    logoutUserFromDB,
};
