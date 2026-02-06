import type { Request, Response, NextFunction } from "express";
import {
  changeEmailValidator,
  changeBirthYearValidator,
  changeUsernameValidator,
  changePasswordValidator,
  changeAdressValidator,
} from "../validator/user.validation.js";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";

// change email validatiim moddleware

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

// change password validation moddleware

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

// change username validation middleware

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

/// change birth+year validation middleware

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

// userpic

export const changeUserpicValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.file) {
    return next(CustomErrorHandler.BadRequest("picture is required"));
  }

  next();
};

// change adress

export const changeAdressValidatorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await changeAdressValidator(req.body);

    next();
  } catch (error: any) {
    next(CustomErrorHandler.BadRequest(error.message));
  }
};
