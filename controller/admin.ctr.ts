import type { NextFunction, Request, Response } from "express";
import logger from "../utils/logger.js";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";
import { Auth } from "../model/association.js";
import { UserRoles } from "../enum/user-role.enum.js";

// role upgrade

export const roleUpgrade = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.body;

    const user = await Auth.findByPk(id);

    if (!user) throw CustomErrorHandler.NotFound("User not found");

    user.role = UserRoles.ADMIN;
    await user.save();

    logger.info("role upgraded", {
      user: id,
      superadmin: req.user!.id,
    });

    res.status(200).json({ message: "role upgraded" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Role upgrade error:" + message);

    next(error);
  }
};

/// role downgrade

export const roleDowngrade = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.body;

    const user = await Auth.findByPk(id);

    if (!user) throw CustomErrorHandler.NotFound("User not found");

    user.role = UserRoles.USER;
    await user.save();

    logger.info("role downgraded", {
      user: id,
      superadmin: req.user!.id,
    });

    res.status(200).json({ message: "role downgraded" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Role downgrade error: " + message);

    next(error);
  }
};

// get all users

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await Auth.findAll({
      attributes: { exclude: ["password"] },
    });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};