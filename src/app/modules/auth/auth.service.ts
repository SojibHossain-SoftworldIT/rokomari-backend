import config from "../../config";
import { UserModel } from "../user/user.model";
import { TAuth, TExternalProviderAuth } from "./auth.interface";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import AppError from "../../errors/handleAppError";
import httpStatus from "http-status";

//register a user in database
const registerUserOnDB = async (payload: TAuth) => {
  const result = await UserModel.create(payload);
  return result;
};

//login an user with credentials
const loginUserFromDB = async (payload: TAuth) => {
  const isUserExists = await UserModel.findOne({
    email: payload?.email,
  });

  // Check if a user exists with the provided email
  if (!isUserExists) {
    throw Error("User does not exists!");
  }

  //check password
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

  //generating token
  const jwtPayload = {
    email: isUserExists?.email,
    role: isUserExists?.role,
  };

  //token
  const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "24h",
  });

  const userObject = {
    user: user,
    accessToken: token,
  };

  return userObject;
};

//login an user with credentials
const loginUserUsingProviderFromDB = async (payload: TExternalProviderAuth) => {
  const isUserExists = await UserModel.findOne({
    email: payload?.email,
  });

  // Check if a user exists with the provided email
  if (!isUserExists) {
    const result = await UserModel.create(payload);

    const jwtPayload = {
      email: result?.email,
      role: result?.role,
    };

    //token
    const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
      expiresIn: "24h",
    });

    const userObject = {
      user: result,
      accessToken: token,
    };

    return userObject;
  }

  const user = await UserModel.findByIdAndUpdate(
    isUserExists?._id,
    { status: "active" },
    { new: true }
  );

  //generating token
  const jwtPayload = {
    email: isUserExists?.email,
    role: isUserExists?.role,
  };

  //token
  const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "24h",
  });

  const userObject = {
    user: user,
    accessToken: token,
  };

  return userObject;
};

//logout current user and removing token from cookie
const logoutUserFromDB = async (id: string) => {
  await UserModel.findByIdAndUpdate(id, { status: "inActive" }, { new: true });
  return {};
};

export const AuthServices = {
  registerUserOnDB,
  loginUserFromDB,
  logoutUserFromDB,
  loginUserUsingProviderFromDB,
};
