import { Router, type RequestHandler } from "express";
import {
  RegisterValidatorMiddleware,
  LoginValidatorMiddleware,
  VerifyValidatorMiddleware,
  ResendOTPValidatorMiddleware,
  ForgotPasswordValidatorMiddleware,
} from "../middleware/auth-validation.middleware.js";
import { authorization } from "../middleware/authorization.js";
import { forgotPassword, login, logout, register, resendOTP, verify } from "../controller/auth.ctr.js";

const authRouter = Router();

authRouter.post(
  "/register",
  RegisterValidatorMiddleware,
  register as RequestHandler,
);

authRouter.post("/login", LoginValidatorMiddleware, login as RequestHandler);

authRouter.post("/verify", VerifyValidatorMiddleware, verify as RequestHandler);

authRouter.post(
  "/resend-otp",
  ResendOTPValidatorMiddleware,
  resendOTP as RequestHandler,
);

authRouter.post(
  "/forgot-password",
  ForgotPasswordValidatorMiddleware,
  forgotPassword as RequestHandler,
);

authRouter.post("/logout", authorization, logout as RequestHandler);

export default authRouter;
