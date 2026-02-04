import type { NextFunction, Request, Response } from "express";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";
import dotenv from "dotenv";
dotenv.config();

export const checkSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user || req.user.role !== "superadmin") {
      throw CustomErrorHandler.Forbidden("you are not superadmin");
    }
    next();
  } catch (error: unknown) {
    next(error);
  }
};
