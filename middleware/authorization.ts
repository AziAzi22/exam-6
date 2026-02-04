import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";
import dotenv from "dotenv";
dotenv.config();

export const authorization = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.access_token;
    if (!token) throw CustomErrorHandler.UnAuthorized("access token not found");

    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as any;
    req.user = decoded;
    next();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Authorization error: " + message);
    next(error);
  }
};

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token;
    if (!token) throw CustomErrorHandler.UnAuthorized("access token not found");

    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as any;
    req.user = decoded;

    if (!req.user) {
      throw CustomErrorHandler.UnAuthorized("user not found");
    }

    if (!["admin", "superadmin"].includes(req.user.role)) {
      throw CustomErrorHandler.Forbidden("you are not admin");
    }

    next();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("CheckAdmin error: " + message);
    next(error);
  }
};
