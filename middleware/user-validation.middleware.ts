import type { Request, Response, NextFunction } from "express";
import {
  changeEmailValidator,
  changeBirthYearValidator,
  changeUsernameValidator,
  changePasswordValidator,
} from "../validator/user.validation.js";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";

export const changeEmailValidatorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await changeEmailValidator(req.body);
    next();
  } catch (error: any) {
    next(CustomErrorHandler.BadRequest(error.message));
  }
};

export const changePasswordValidatorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await changePasswordValidator(req.body);
    next();
  } catch (error: any) {
    next(CustomErrorHandler.BadRequest(error.message));
  }
};

export const changeUsernameValidatorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await changeUsernameValidator(req.body);
    next();
  } catch (error: any) {
    next(CustomErrorHandler.BadRequest(error.message));
  }
};

export const changeBirthYearValidatorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await changeBirthYearValidator(req.body);
    next();
  } catch (error: any) {
    next(CustomErrorHandler.BadRequest(error.message));
  }
};
