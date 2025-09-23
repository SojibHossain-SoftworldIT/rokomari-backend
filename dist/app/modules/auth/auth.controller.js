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
exports.AuthController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const registerUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = req.body;
    const result = yield auth_service_1.AuthServices.registerUserOnDB(userInfo);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "User has been registered successfully!",
        data: result,
    });
}));
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = req === null || req === void 0 ? void 0 : req.body;
    const result = yield auth_service_1.AuthServices.loginUserFromDB(userInfo);
    (0, sendResponse_1.default)(res
        .cookie("accessToken", result === null || result === void 0 ? void 0 : result.accessToken, {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        sameSite: "none",
        maxAge: 15 * 60 * 1000, // 15 minutes
    })
        .cookie("refreshToken", result === null || result === void 0 ? void 0 : result.refreshToken, {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }), {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User Logged in Successfully!",
        data: result === null || result === void 0 ? void 0 : result.user,
    });
}));
const loginUserUsingProvider = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = req === null || req === void 0 ? void 0 : req.body;
    const result = yield auth_service_1.AuthServices.loginUserUsingProviderFromDB(userInfo);
    (0, sendResponse_1.default)(res
        .cookie("accessToken", result === null || result === void 0 ? void 0 : result.accessToken, {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
        .cookie("refreshToken", result === null || result === void 0 ? void 0 : result.refreshToken, {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }), {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User Logged in Successfully!",
        data: result === null || result === void 0 ? void 0 : result.user,
    });
}));
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
    if (!refreshToken) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.UNAUTHORIZED,
            success: false,
            message: "No refresh token provided",
            data: null,
        });
    }
    const result = yield auth_service_1.AuthServices.refreshAccessToken(refreshToken);
    (0, sendResponse_1.default)(res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
    }), {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Access token refreshed successfully",
        data: null,
    });
}));
const logOutUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const result = yield auth_service_1.AuthServices.logoutUserFromDB(userId);
    (0, sendResponse_1.default)(res
        .cookie("accessToken", "", {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        sameSite: "none",
        maxAge: 0,
    })
        .cookie("refreshToken", "", {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        sameSite: "none",
        maxAge: 0,
    }), {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User Logged Out Successfully!",
        data: result,
    });
}));
exports.AuthController = {
    registerUser,
    loginUser,
    loginUserUsingProvider,
    refreshToken,
    logOutUser,
};
