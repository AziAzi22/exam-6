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
    const result = await RegisterValidator(req.body);

    req.body = result.value;

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
    const result = LoginValidator(req.body);

    req.body = result.value;

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
    const result = VerifyValidator(req.body);

    req.body = result.value;

    next();
  } catch (error: unknown) {
    throw CustomErrorHandler.BadRequest((error as Error).message);
  }
};

// resend otp validation

export const ResendOTPValidatorMiddleware =  (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result =   ResendOTPValidator(req.body);

    req.body = result.value;

    next();
  } catch (error: unknown) {
    throw CustomErrorHandler.BadRequest((error as Error).message);
  }
};

/// forgot password validation

export const ForgotPasswordValidatorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ForgotPasswordValidator(req.body);

    req.body = result.value;

    next();
  } catch (error: unknown) {
    throw CustomErrorHandler.BadRequest((error as Error).message);
  }
};
