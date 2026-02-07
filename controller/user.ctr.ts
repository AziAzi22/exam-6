import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";
import logger from "../utils/logger.js";
import { Auth } from "../model/association.js";

// GET PROFILE

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await Auth.findByPk(req.user!.id);

    if (!user) {
      throw CustomErrorHandler.NotFound("User not found");
    }
 
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      birth_year: user.birth_year,
      role: user.role,
      userpic: user.userpic,
      adress: user.adress,
    });
  } catch (error: unknown) {
    logger.error("get profile error: " + (error as Error).message);
    next(error);
  }
};

// CHANGE USERNAME

export const changeUsername = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username } = req.body;

    await Auth.update({ username }, { where: { id: req.user!.id } });

    logger.info(`username updated userId=${req.user!.id}`);

    res.status(200).json({ message: "username updated" });
  } catch (error: unknown) {
    logger.error("change username error: " + (error as Error).message);
    next(error);
  }
};

// CHANGE BIRTH YEAR

export const changeBirthYear = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { birth_year } = req.body;

    await Auth.update({ birth_year }, { where: { id: req.user!.id } });

    res.status(200).json({ message: "birth_year updated" });
  } catch (error: unknown) {
    logger.error("change birth year error: " + (error as Error).message);
    next(error);
  }
};

// CHANGE PASSWORD

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { current_password, new_password, confirm_password } = req.body;

    const user = await Auth.findByPk(req.user!.id);

    if (!user) {
      throw CustomErrorHandler.NotFound("User not found");
    }

    if (new_password !== confirm_password) {
      throw CustomErrorHandler.BadRequest("Passwords do not match");
    }

    if (current_password === new_password) {
      throw CustomErrorHandler.BadRequest("New password must be different");
    }

    const match = await bcrypt.compare(current_password, user.password);

    if (!match) {
      throw CustomErrorHandler.UnAuthorized("Invalid password");
    }

    const hash = await bcrypt.hash(new_password, 14);

    await user.update({ password: hash });

    res.status(200).json({ message: "password changed" });
  } catch (error: unknown) {
    logger.error("change password error: " + (error as Error).message);
    next(error);
  }
};

// CHANGE EMAIL

export const changeEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { new_email, old_password, new_password, confirm_password } =
      req.body;

    const user = await Auth.findByPk(req.user!.id);

    if (!user) {
      throw CustomErrorHandler.NotFound("User not found");
    }

    const emailExists = await Auth.findOne({
      where: { email: new_email },
    });

    if (emailExists) {
      throw CustomErrorHandler.BadRequest("email already exists");
    }

    if (old_password === new_password) {
      throw CustomErrorHandler.BadRequest(
        "new password and current password must be different",
      );
    }

    if (confirm_password !== new_password) {
      throw CustomErrorHandler.BadRequest(
        "new password and confirm password must be same",
      );
    }

    const match = await bcrypt.compare(old_password, user.password);

    if (!match) {
      throw CustomErrorHandler.UnAuthorized("Invalid password");
    }

    const hash = await bcrypt.hash(new_password, 14);

    const oldEmail = user.email;

    await user.update({
      email: new_email,
      password: hash,
      isVerified: false,
    });

    logger.info(`Email changed from ${oldEmail} to ${new_email}`);

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    res.status(200).json({
      message: "email changed please verify your new email",
    });
  } catch (error: unknown) {
    logger.error("change email error: " + (error as Error).message);
    next(error);
  }
};

// CHANGE USERPIC

export const changeUserpic = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      throw CustomErrorHandler.BadRequest("file not uploaded");
    }

    const path = "../upload/images/" + req.file.filename;

    await Auth.update({ userpic: path }, { where: { id: req.user!.id } });

    res.status(200).json({
      message: "userpic updated",
      userpic: path,
    });
  } catch (error: unknown) {
    logger.error("change userpic error: " + (error as Error).message);
    next(error);
  }
};

// CHANGE ADRESS

export const changeAdress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { adress } = req.body;

    const user = await Auth.findByPk(req.user!.id);

    if (!user) {
      throw CustomErrorHandler.NotFound("User not found");
    }

    await user.update({ adress });

    res.status(200).json({ message: "adress changed" });
  } catch (error: unknown) {
    logger.error("change adress error: " + (error as Error).message);
    next(error);
  }
};
