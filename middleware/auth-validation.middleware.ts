import type { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.js";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";
import {
  RegisterValidator,
  LoginValidator,
  VerifyValidator,
  ResendOTPValidator,
  ForgotPasswordValidator,
} from "../validator/auth.validation.js";

/// register validation
export const RegisterValidatorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const value = await RegisterValidator(req.body);

    req.body = value;

    next();
  } catch (error: unknown) {
    throw CustomErrorHandler.BadRequest((error as Error).message);
  }
};

// login validation

export const LoginValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const value = LoginValidator(req.body);

    req.body = value;

    next();
  } catch (error: unknown) {
    throw CustomErrorHandler.BadRequest((error as Error).message);
  }
};

/// verify validation

export const VerifyValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const value = VerifyValidator(req.body);

    req.body = value;

    next();
  } catch (error: unknown) {
    throw CustomErrorHandler.BadRequest((error as Error).message);
  }
};

// resend otp validation

export const ResendOTPValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const value = ResendOTPValidator(req.body);

    req.body = value;

    next();
  } catch (error: unknown) {
    throw CustomErrorHandler.BadRequest((error as Error).message);
  }
};

/// forgot password validation

export const ForgotPasswordValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const value = ForgotPasswordValidator(req.body);

    req.body = value;

    next();
  } catch (error: unknown) {
    throw CustomErrorHandler.BadRequest((error as Error).message);
  }
};
