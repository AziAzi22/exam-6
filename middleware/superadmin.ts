import type { Request, Response, NextFunction } from "express";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";
import { UserRoles } from "../enum/user-role.enum.js";

export const superAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== UserRoles.SUPERADMIN) {
      throw CustomErrorHandler.Forbidden("you are not superadmin");
    }
    next();
  } catch (error) {
    next(error);
  }
};
