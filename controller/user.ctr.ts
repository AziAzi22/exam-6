import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";
import logger from "../utils/logger.js";
import { Auth } from "../model/auth.model.js";

// get profile

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await Auth.findByPk(req.user!.id);

    if (!user) throw CustomErrorHandler.NotFound("User not found");

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      birth_year: user.birth_year,
      role: user.role,
      userpic: user.userpic,
    });
  } catch (error: unknown) {
    logger.error(
      "get profile error",
      error instanceof Error ? error.message : String(error),
    );
    next(error);
  }
};

// change username

export const changeUsername = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username } = req.body;
    if (!username) throw CustomErrorHandler.BadRequest("username is required");

    await Auth.update({ username }, { where: { id: req.user!.id } });

    logger.info("username updated from user:", req.user!.id);

    res.status(200).json({ message: "username updated" });
  } catch (error: unknown) {
    logger.error(
      "change username error",
      error instanceof Error ? error.message : String(error),
    );
    next(error);
  }
};

// change birth year

export const changeBirthYear = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { birth_year } = req.body;
    if (!birth_year)
      throw CustomErrorHandler.BadRequest("birth_year is required");

    await Auth.update({ birth_year }, { where: { id: req.user!.id } });

    res.status(200).json({ message: "birth_year updated" });
  } catch (error: unknown) {
    logger.error(
      "change birth year error",
      error instanceof Error ? error.message : String(error),
    );
    next(error);
  }
};

// change password

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { current_password, new_password, confirm_password } = req.body;

    const user = await Auth.findByPk(req.user!.id);

    if (!user) throw CustomErrorHandler.NotFound("User not found");

    if (new_password !== confirm_password)
      throw CustomErrorHandler.BadRequest("Passwords do not match");
    if (current_password === new_password)
      throw CustomErrorHandler.BadRequest("New password must be different");

    const match = await bcrypt.compare(current_password, user.password);
    if (!match) throw CustomErrorHandler.UnAuthorized("Invalid password");

    const hash = await bcrypt.hash(new_password, 14);
    await user.update({ password: hash });

    res.status(200).json({ message: "password changed" });
  } catch (error: unknown) {
    logger.error(
      "change password error",
      error instanceof Error ? error.message : String(error),
    );
    next(error);
  }
};
