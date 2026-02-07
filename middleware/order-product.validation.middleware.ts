import type { NextFunction, Request, Response } from "express";
import {
  buyProductValidator,
  updateAdressOrderProductValidator,
  updatePaymentMethodOrderProductValidator,
} from "../validator/order-product.validation.js";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";

// buy product

export const buyProductValidatorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await buyProductValidator(req.body);

    req.body = result.value;

    next();
  } catch (error: unknown) {
    throw CustomErrorHandler.BadRequest((error as Error).message);
  }
};

// update adress order product validator

export const updateAdressOrderProductValidatorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await updateAdressOrderProductValidator(req.body);

    req.body = result.value;

    next();
  } catch (error: unknown) {
    throw CustomErrorHandler.BadRequest((error as Error).message);
  }
};

// update payment method validator

export const updatePaymentMethodOrderProductValidatorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await updatePaymentMethodOrderProductValidator(req.body);

    req.body = result.value;

    next();
  } catch (error: unknown) {
    throw CustomErrorHandler.BadRequest((error as Error).message);
  }
};
