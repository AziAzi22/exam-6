import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { CustomErrorHandler } from "./custom-error-handler.js";
dotenv.config();

type Payload = Record<string, any>;

// access token
export const accessToken = (payload: Payload): string => {
  if (!process.env.ACCESS_SECRET_KEY) {
    throw CustomErrorHandler.BadRequest("ACCESS_SECRET_KEY is not defined");
  }
  try {
    return jwt.sign(payload, process.env.ACCESS_SECRET_KEY, {
      expiresIn: "1h",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw CustomErrorHandler.BadRequest(message);
  }
};

// refresh token
export const refreshToken = (payload: Payload): string => {
  if (!process.env.REFRESH_SECRET_KEY) {
    throw CustomErrorHandler.BadRequest("REFRESH_SECRET_KEY is not defined");
  }

  try {
    return jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {
      expiresIn: "30d",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw CustomErrorHandler.BadRequest(message);
  }
};
