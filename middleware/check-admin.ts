import type { NextFunction, Request, Response } from "express";
import { UserRoles } from "../enum/user-role.enum.js";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.access_token;

    if (!token) throw CustomErrorHandler.UnAuthorized("access token not found");

    if (!req.user) {
      throw CustomErrorHandler.UnAuthorized("user not found");
    }

    if (
      ![UserRoles.ADMIN, UserRoles.SUPERADMIN].includes(
        req.user.role as UserRoles,
      )
    ) {
      throw CustomErrorHandler.Forbidden("you are not admin");
    }

    next();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("CheckAdmin error: " + message);

    next(error);
  }
};
