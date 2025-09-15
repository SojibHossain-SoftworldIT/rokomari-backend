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
const config_1 = __importDefault(require("../../config"));
const user_model_1 = require("../user/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const http_status_1 = __importDefault(require("http-status"));
//register a user in database
const registerUserOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.UserModel.create(payload);
    return result;
});
//login an user with credentials
const loginUserFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.UserModel.findOne({
        email: payload === null || payload === void 0 ? void 0 : payload.email,
    });
    // Check if a user exists with the provided email
    if (!isUserExists) {
        throw Error("User does not exists!");
    }
    //check password
    const isPasswordMatched = yield bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.password, isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.password);
    if (!isPasswordMatched) {
        throw new handleAppError_1.default(http_status_1.default.UNAUTHORIZED, "Wrong Credentials!");
    }
    const user = yield user_model_1.UserModel.findByIdAndUpdate(isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists._id, { status: "active" }, { new: true });
    //generating token
    const jwtPayload = {
        email: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.email,
        role: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.role,
    };
    //token
    const token = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: "24h",
    });
    const userObject = {
        user: user,
        accessToken: token,
    };
    return userObject;
});
//login an user with credentials
const loginUserUsingProviderFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.UserModel.findOne({
        email: payload === null || payload === void 0 ? void 0 : payload.email,
    });
    // Check if a user exists with the provided email
    if (!isUserExists) {
        const result = yield user_model_1.UserModel.create(payload);
        const jwtPayload = {
            email: result === null || result === void 0 ? void 0 : result.email,
            role: result === null || result === void 0 ? void 0 : result.role,
        };
        //token
        const token = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
            expiresIn: "24h",
        });
        const userObject = {
            user: result,
            accessToken: token,
        };
        return userObject;
    }
    const user = yield user_model_1.UserModel.findByIdAndUpdate(isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists._id, { status: "active" }, { new: true });
    //generating token
    const jwtPayload = {
        email: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.email,
        role: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.role,
    };
    //token
    const token = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: "24h",
    });
    const userObject = {
        user: user,
        accessToken: token,
    };
    return userObject;
});
//logout current user and removing token from cookie
const logoutUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_model_1.UserModel.findByIdAndUpdate(id, { status: "inActive" }, { new: true });
    return {};
});
exports.AuthServices = {
    registerUserOnDB,
    loginUserFromDB,
    logoutUserFromDB,
    loginUserUsingProviderFromDB,
};
