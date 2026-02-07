import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { otpGenerator } from "../utils/otp-generator.js";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";
import logger from "../utils/logger.js";
import { sendMessage } from "../utils/email-sender.js";
import { accessToken, refreshToken } from "../utils/token-generator.js";
import type {
  ForgotPasswordDTO,
  LoginDTO,
  RegisterDTO,
  ResendOTPDTO,
  VerifyDTO,
} from "../dto/auth.dto.js";
import { Op } from "sequelize";
import { Logger } from "../model/logger.model.js";
import { Auth } from "../model/association.js";

Auth.sync({ force: false });

Logger.sync({ force: false });

// register

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, email, password, birth_year } = req.body as RegisterDTO;

    const exists = await Auth.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (exists) {
      return res
        .status(400)
        .json({ message: "Email or username already exists" });
    }

    const hash = await bcrypt.hash(password, 14);

    const generatedCode = otpGenerator();
    const time = Date.now() + 5 * 60 * 1000;

    await Auth.create({
      userpic: "../upload/images/default_photo.jpg",
      username,
      email,
      password: hash,
      birth_year,
      otp: generatedCode,
      otpTime: time,
    });

    await sendMessage(email, generatedCode);

    logger.info(`user registered with email: ${email}`);

    res.status(201).json({
      message: "you are registred ✌️",
    });
  } catch (error) {
    logger.error("Register error: " + String(error));
    next(error);
  }
};

// verify

export const verify = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp } = req.body as VerifyDTO;

    const foundedUser = await Auth.findOne({ where: { email } });

    if (!foundedUser) {
      throw CustomErrorHandler.NotFound("User not found");
    }

    const time = Date.now();
    const otpTime = Number(foundedUser.otpTime);

    if (time > otpTime) {
      throw CustomErrorHandler.BadRequest("OTP time expired");
    }

    if (otp !== foundedUser.otp) {
      throw CustomErrorHandler.BadRequest("wrong verification code");
    }

    foundedUser.isVerified = true;
    foundedUser.otp = null;
    foundedUser.otpTime = null;

    await foundedUser.save();

    const payload = {
      username: foundedUser.username,
      email: foundedUser.email,
      role: foundedUser.role,
      id: foundedUser.id,
    };

    const access_token = accessToken(payload);
    const refresh_token = refreshToken(payload);

    res.cookie("access_token", access_token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 1000,
    });

    res.status(200).json({
      message: "Succes",
      access_token,
    });
  } catch (error) {
    logger.error("Verify error:" + String(error));
    next(error);
  }
};

/// resend OTP

export const resendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body as ResendOTPDTO;

    const foundedUser = await Auth.findOne({ where: { email } });

    if (!foundedUser) {
      throw CustomErrorHandler.UnAuthorized("you are not registered");
    }

    const generatedCode = otpGenerator();
    const time = Date.now() + 5 * 60 * 1000;

    foundedUser.otp = generatedCode;
    foundedUser.otpTime = time;

    await foundedUser.save();
    await sendMessage(email, generatedCode);

    res.status(200).json({
      message: "verification code resent",
    });
  } catch (error) {
    logger.error("Resend OTP error:" + String(error));
    next(error);
  }
};

// login

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body as LoginDTO;

    const user = await Auth.findOne({ where: { email } });

    if (!user) {
      throw CustomErrorHandler.NotFound("you are not registered");
    }

    const decode = await bcrypt.compare(password, user.password);

    if (!decode) {
      throw CustomErrorHandler.UnAuthorized("Invalid password");
    }

    if (!user.isVerified) {
      throw CustomErrorHandler.UnAuthorized("you are not verified");
    }

    const payload = {
      username: user.username,
      email: user.email,
      role: user.role,
      id: user.id,
    };

    const access_token = accessToken(payload);
    const refresh_token = refreshToken(payload);

    res.cookie("access_token", access_token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 1000,
    });

    res.status(200).json({
      message: "Succes",
      access_token,
    });
  } catch (error) {
    logger.error("Login error:" + String(error));
    next(error);
  }
};

// forget password

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, new_password, otp } = req.body as ForgotPasswordDTO;

    const user = await Auth.findOne({ where: { email } });

    if (!user) {
      throw CustomErrorHandler.UnAuthorized("User not found");
    }

    if (!user.dataValues.isVerified) {
      throw CustomErrorHandler.UnAuthorized("user not verified");
    }

    const time = Date.now();

    if (time > user.dataValues.otpTime) {
      throw CustomErrorHandler.BadRequest("OTP time expired");
    }

    if (otp !== user.dataValues.otp) {
      throw CustomErrorHandler.BadRequest("wrong verification code");
    }

    const hash = await bcrypt.hash(new_password, 14);

    await Auth.update(
      {
        password: hash,
        otp: null,
        otpTime: null,
      },
      {
        where: {
          id: user.dataValues.id as number,
        },
      },
    );

    res.status(200).json({
      message: "Password changed",
    });
  } catch (error) {
    logger.error("Forgot password error:" + String(error));
    next(error);
  }
};

// logout

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    logger.info("user logged out");

    res.status(200).json({
      message: "you are logged out",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Logout error:" + message);

    next(error);
  }
};
