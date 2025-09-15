import { AuthServices } from "./auth.service";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import config from "../../config";

const registerUser = catchAsync(async (req, res) => {
  const userInfo = req.body;
  const result = await AuthServices.registerUserOnDB(userInfo);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User has been registered successfully!",
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const userInfo = req?.body;
  const result = await AuthServices.loginUserFromDB(userInfo);

  sendResponse(
    res.cookie("accessToken", result?.accessToken, {
      httpOnly: true,
      secure: config.node_env === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    }),
    {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged in Successfully!",
      data: result?.user,
    }
  );
});

const loginUserUsingProvider = catchAsync(async (req, res) => {
  const userInfo = req?.body;
  const result = await AuthServices.loginUserUsingProviderFromDB(userInfo);

  sendResponse(
    res.cookie("accessToken", result?.accessToken, {
      httpOnly: true,
      secure: config.node_env === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    }),
    {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged in Successfully!",
      data: result?.user,
    }
  );
});

const logOutUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await AuthServices.logoutUserFromDB(userId);

  sendResponse(
    res.cookie("accessToken", "", {
      httpOnly: true,
      secure: config.node_env === "production",
      sameSite: "none",
      maxAge: 0,
    }),
    {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged Out Successfully!",
      data: result,
    }
  );
});

export const AuthController = {
  registerUser,
  loginUser,
  logOutUser,
  loginUserUsingProvider,
};
