import httpStatus from "http-status";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

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
    res
      .cookie("accessToken", result?.accessToken, {
        httpOnly: true,
        secure: config.node_env === "production",
        sameSite: "none",
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .cookie("refreshToken", result?.refreshToken, {
        httpOnly: true,
        secure: config.node_env === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
    res
      .cookie("accessToken", result?.accessToken, {
        httpOnly: true,
        secure: config.node_env === "production",
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      })
      .cookie("refreshToken", result?.refreshToken, {
        httpOnly: true,
        secure: config.node_env === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      }),
    {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged in Successfully!",
      data: result?.user,
    }
  );
});

const refreshToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "No refresh token provided",
      data: null,
    });
  }

  const result = await AuthServices.refreshAccessToken(refreshToken);

  sendResponse(
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: config.node_env === "production",
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    }),
    {
      success: true,
      statusCode: httpStatus.OK,
      message: "Access token refreshed successfully",
      data: null,
    }
  );
});

const logOutUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await AuthServices.logoutUserFromDB(userId);

  sendResponse(
    res
      .cookie("accessToken", "", {
        httpOnly: true,
        secure: config.node_env === "production",
        sameSite: "none",
        maxAge: 0,
      })
      .cookie("refreshToken", "", {
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
  loginUserUsingProvider,
  refreshToken,
  logOutUser,
};
