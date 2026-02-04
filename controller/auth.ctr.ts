import { Auth } from "../model/auth.model.js";
import type { Request, Response, NextFunction } from "express";
import {
  ForgotPasswordValidator,
  LoginValidator,
  RegisterValidator,
  ResendOTPValidator,
  VerifyValidator,
} from "../validator/auth.validation.js";
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
import { Op, ValidationError } from "sequelize";
import type { ValidationResult } from "joi";

Auth.sync({ force: false });

// register

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const result: ValidationResult = await RegisterValidator(req.body);

    if (result.error) {
      throw CustomErrorHandler.BadRequest(result.error.message);
    }

    const { username, email, password, birth_year } =
      result.value as RegisterDTO;

    const exists = await Auth.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (exists) {
      logger.warn(`Register attempt with existing email/username: ${email}`);

      return res
        .status(400)
        .json({ message: "Email or username already exists" });
    }

    const hash = await bcrypt.hash(password, 14);

    const generatedCode = otpGenerator();

    const time = Date.now() + 5 * 60 * 1000;

    await Auth.create({
      userpic: "/images/default_photo_for_profile.png",
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
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      throw CustomErrorHandler.BadRequest(error.message);
    }

    const message = error instanceof Error ? error.message : String(error);

    logger.error("Register error: " + message);

    next(error);
  }
};

// verify

export const verify = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const result: ValidationResult = await VerifyValidator(req.body);

    if (result.error) {
      throw CustomErrorHandler.BadRequest(result.error.message);
    }

    const { email, otp } = result.value as VerifyDTO;

    const foundedUser = await Auth.findOne({ where: { email: email } });

    if (!foundedUser) {
      logger.warn(`Verification attempt with non-existing email: ${email}`);

      throw CustomErrorHandler.NotFound("User not found");
    }

    // if (foundedUser.isVerified) {
    //   throw CustomErrorHandler.BadRequest("User already verified");
    // }

    const time = Date.now();

    if (time > foundedUser.dataValues.otpTime) {
      logger.warn(`Verification attempt with expired OTP: ${email}`);

      throw CustomErrorHandler.BadRequest("OTP time expired");
    }

    if (otp !== foundedUser.dataValues.otp) {
      logger.warn(`Verification attempt with wrong OTP: ${email}`);

      throw CustomErrorHandler.BadRequest("wrong verification code");
    }

    foundedUser.isVerified = true;
    foundedUser.otp = null;
    foundedUser.otpTime = null;

    await foundedUser.save();

    const payload = {
      username: foundedUser.username,
      email: foundedUser.dataValues.dataValues.email,
      role: foundedUser.dataValues.role,
      id: foundedUser.dataValues.id,
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

    logger.info(`user verified with email: ${email}`);

    res.status(200).json({
      message: "Succes",
      access_token,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Verify error:" + message);

    next(error);
  }
};

/// resend OTP

export const resendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const result: ValidationResult = await ResendOTPValidator(req.body);

    if (result.error) {
      throw CustomErrorHandler.BadRequest(result.error.message);
    }

    const { email } = result.value as ResendOTPDTO;

    const foundedUser = await Auth.findOne({ where: { email: email } });

    if (!foundedUser) {
      logger.warn(`Resend OTP attempt with non-existing email: ${email}`);

      throw CustomErrorHandler.UnAuthorized("you are not registered");
    }

    const generatedCode = otpGenerator();

    const time = Date.now() + 5 * 60 * 1000;

    foundedUser.dataValues.otp = generatedCode;
    foundedUser.dataValues.otpTime = time;
    await foundedUser.save();

    await sendMessage(email, generatedCode);

    logger.info(`OTP resent email: ${email}`);

    res.status(200).json({
      message: "verification code resent",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Resend OTP error:" + message);

    next(error);
  }
};

// login

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const result: ValidationResult = await LoginValidator(req.body);

    if (result.error) {
      throw CustomErrorHandler.BadRequest(result.error.message);
    }

    const { email, password } = result.value as LoginDTO;

    const user = await Auth.findOne({ where: { email: email } });

    if (!user) {
      logger.warn(`Login attempt with non-existing email: ${email}`);

      throw CustomErrorHandler.NotFound("you are not registered");
    }

    const decode = await bcrypt.compare(password, user.password);

    if (!decode) {
      logger.warn(`Login attempt with wrong password: ${email}`);

      throw CustomErrorHandler.UnAuthorized("Invalid password");
    }

    if (!user.dataValues.isVerified) {
      logger.warn(`Login attempt with non-verified email: ${email}`);

      throw CustomErrorHandler.UnAuthorized("you are not verified");
    }

    const payload = {
      username: user.username,
      email: user.email,
      role: user.dataValues.role,
      id: user.dataValues.id,
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

    logger.info(`user logged with email: ${email}`);

    res.status(200).json({
      message: "Succes",
      access_token,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Login error:" + message);

    next(error);
  }
};

// forget password

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const result: ValidationResult = await ForgotPasswordValidator(req.body);

    if (result.error) {
      throw CustomErrorHandler.BadRequest(result.error.message);
    }

    const { email, new_password, otp } = result.value as ForgotPasswordDTO;

    const user = await Auth.findOne({ where: { email: email } });

    if (!user) {
      logger.warn(`Forgot password attempt with non-existing email: ${email}`);

      throw CustomErrorHandler.UnAuthorized("User not found");
    }

    if (!user.dataValues.isVerified) {
      logger.warn(`Forgot password attempt with non-verified email: ${email}`);

      throw CustomErrorHandler.UnAuthorized("user not verified");
    }

    const time = Date.now();

    if (time > user.dataValues.otpTime) {
      logger.warn(`Forgot password attempt with expired otp: ${email}`);

      throw CustomErrorHandler.BadRequest("OTP time expired");
    }

    if (otp !== user.dataValues.otp) {
      logger.warn(`Forgot password attempt with wrong otp: ${email}`);

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

    logger.info(`user forgot password with email: ${email}`);

    res.status(200).json({
      message: "Password changed",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Forgot password error:" + message);

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
