import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { accessToken } from "../utils/token-generator.js";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";

export const refreshTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.refresh_token;
    if (!token)
      throw CustomErrorHandler.UnAuthorized("refresh token not found");

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET_KEY!) as any;

    const payload = {
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
      id: decoded.id,
    };

    const newAccessToken = accessToken(payload);
    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ message: "Success", access_token: newAccessToken });
  } catch (error: unknown) {
    next(error);
  }
};
