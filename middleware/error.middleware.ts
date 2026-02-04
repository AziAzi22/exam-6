import type { Request, Response, NextFunction } from "express";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (err instanceof CustomErrorHandler) {
      return res
        .status(err.status)
        .json({ message: err.message, error: err.errors });
    }

    if ((err as any).name === "ValidationError") {
      const errorMessages = (err as any).message.split(",");
      return res.status(400).json({ message: errorMessages });
    }

    if ((err as any).code === 11000) {
      return res.status(409).json({
        message: "Duplicate field value",
        fields: Object.keys((err as any).keyValue),
      });
    }

    return res.status(500).json({ message: (err as any).message });
  } catch (error: unknown) {
    return res.status(500).json({ message: (error as any).message });
  }
};
