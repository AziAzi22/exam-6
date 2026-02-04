import type { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      email: string;
      username?: string;
      role: "user" | "admin" | "superadmin";
    };
  }
}
