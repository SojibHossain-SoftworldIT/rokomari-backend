import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { AuthValidations } from "./auth.validations";

const router = express.Router();

// Individual routes

router.post(
  "/register",
  validateRequest(AuthValidations.registerUser),
  AuthController.registerUser
);

router.post(
  "/login",
  validateRequest(AuthValidations.loginUser),
  AuthController.loginUser
);

router.post("/logout/:id", AuthController.logOutUser);

router.post(
  "/login/provider",
  validateRequest(AuthValidations.loginUserUsingProvider),
  AuthController.loginUserUsingProvider
);

// Refresh access token using refresh token
router.post("/refresh-token", AuthController.refreshToken);

export const AuthRoutes = router;
