import type { NextFunction, Request, Response } from "express";
import {
  buyProductValidator,
  cancelOrderProductValidator,
  updateAdressOrderProductValidator,
  updatePaymentMethodOrderProductValidator,
  updateStatusOrderProductValidator,
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

// cancel product

export const cancelOrderProductValidatorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await cancelOrderProductValidator(req.body);

    req.body = result.value;

    next();
  } catch (error: unknown) {
    throw CustomErrorHandler.BadRequest((error as Error).message);
  }
};

// update status product

export const updateStatusOrderProductValidatorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await updateStatusOrderProductValidator(req.body);

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
