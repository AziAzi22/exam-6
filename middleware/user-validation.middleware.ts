import type { Request, Response, NextFunction } from "express";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";

import {
  changeUsernameValidator,
  changeBirthYearValidator,
  changePasswordValidator,
  changeEmailValidator,
  changeAdressValidator,
} from "../validator/user.validation.js";

export const changeUsernameValidatorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.body = await changeUsernameValidator(req.body);
    next();
  } catch (error: unknown) {
    next(CustomErrorHandler.BadRequest((error as Error).message));
  }
};

export const changeBirthYearValidatorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.body = await changeBirthYearValidator(req.body);
    next();
  } catch (error: unknown) {
    next(CustomErrorHandler.BadRequest((error as Error).message));
  }
};

export const changePasswordValidatorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.body = await changePasswordValidator(req.body);
    next();
  } catch (error: unknown) {
    next(CustomErrorHandler.BadRequest((error as Error).message));
  }
};

export const changeEmailValidatorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.body = await changeEmailValidator(req.body);
    next();
  } catch (error: unknown) {
    next(CustomErrorHandler.BadRequest((error as Error).message));
  }
};

export const changeAdressValidatorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.body = await changeAdressValidator(req.body);
    next();
  } catch (error: unknown) {
    next(CustomErrorHandler.BadRequest((error as Error).message));
  }
};
