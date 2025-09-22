import bcrypt from "bcrypt";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import config from "../../config";
import AppError from "../../errors/handleAppError";
import { UserModel } from "../user/user.model";
import { TAuth, TExternalProviderAuth } from "./auth.interface";

// Helper to generate tokens
const generateTokens = (payload: object) => {
  const accessToken = jwt.sign(payload, config.jwt_access_secret as string, {
    expiresIn: "15m", // shorter-lived
  });

  const refreshToken = jwt.sign(payload, config.jwt_refresh_secret as string, {
    expiresIn: "7d", // longer-lived
  });

  return { accessToken, refreshToken };
};

// Register a user in database
const registerUserOnDB = async (payload: TAuth) => {
  const result = await UserModel.create(payload);
  return result;
};

// Login with credentials
const loginUserFromDB = async (payload: TAuth) => {
  const isUserExists = await UserModel.findOne({ email: payload?.email });

  if (!isUserExists) {
    throw Error("User does not exists!");
  }

  // check password
  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    isUserExists?.password
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Wrong Credentials!");
  }

  const user = await UserModel.findByIdAndUpdate(
    isUserExists?._id,
    { status: "active" },
    { new: true }
  );

  const jwtPayload = {
    email: isUserExists?.email,
    role: isUserExists?.role,
  };

  const { accessToken, refreshToken } = generateTokens(jwtPayload);

  return { user, accessToken, refreshToken };
};

// Login with provider
const loginUserUsingProviderFromDB = async (payload: TExternalProviderAuth) => {
  let user = await UserModel.findOne({ email: payload?.email });

  if (!user) {
    user = await UserModel.create(payload);
  } else {
    user = await UserModel.findByIdAndUpdate(
      user._id,
      { status: "active" },
      { new: true }
    );
  }

  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };

  const { accessToken, refreshToken } = generateTokens(jwtPayload);

  return { user, accessToken, refreshToken };
};

// Refresh token
const refreshAccessToken = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      config.jwt_refresh_secret as string
    ) as jwt.JwtPayload;

    const jwtPayload = {
      email: decoded.email,
      role: decoded.role,
    };

    const accessToken = jwt.sign(
      jwtPayload,
      config.jwt_access_secret as string,
      { expiresIn: "15m" }
    );

    return { accessToken };
  } catch (error) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid or expired refresh token"
    );
  }
};

// Logout
const logoutUserFromDB = async (id: string) => {
  await UserModel.findByIdAndUpdate(id, { status: "inActive" }, { new: true });
  return {};
};

export const AuthServices = {
  registerUserOnDB,
  loginUserFromDB,
  loginUserUsingProviderFromDB,
  refreshAccessToken,
  logoutUserFromDB,
};
