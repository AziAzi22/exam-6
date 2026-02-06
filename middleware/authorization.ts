import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";
import dotenv from "dotenv";
import type { UserRoles } from "../enum/user-role.enum.js";
dotenv.config();

export const authorization = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.access_token;

    if (!token) throw CustomErrorHandler.UnAuthorized("access token not found");

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY!) as {
      id: number;
      email: string;
      role: UserRoles;
    };

    req.user = decoded;

    next();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Authorization error: " + message);
    next(error);
  }
};
