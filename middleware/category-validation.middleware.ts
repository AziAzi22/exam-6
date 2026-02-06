import type { NextFunction, Request, Response } from "express";
import {
  CreateCategoryValidator,
  UpdateCategoryValidator,
} from "../validator/category.validation.js";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";

// create category

export const CreateCategoryValidatorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await CreateCategoryValidator(req.body);

    req.body = result.value;

    next();
  } catch (error: unknown) {
    throw CustomErrorHandler.BadRequest((error as Error).message);
  }
};

// update category

export const UpdateCategoryValidatorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await UpdateCategoryValidator(req.body);

    req.body = result.value;

    next();
  } catch (error: unknown) {
    throw CustomErrorHandler.BadRequest((error as Error).message);
  }
};
