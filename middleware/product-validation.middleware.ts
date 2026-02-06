import type { NextFunction, Request, Response } from "express";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";
import {
  CreateProductValidator,
  UpdateProductValidator,
} from "../validator/product.validation.js";

// create product

export const CreateProductValidatorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await CreateProductValidator(req.body);

    req.body = result.value;

    next();
  } catch (error: unknown) {
    throw CustomErrorHandler.BadRequest((error as Error).message);
  }
};

// update product

export const UpdateProductValidatorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await UpdateProductValidator(req.body);

    req.body = result.value;

    next();
  } catch (error: unknown) {
    throw CustomErrorHandler.BadRequest((error as Error).message);
  }
};
