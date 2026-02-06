import type { UserRoles } from "../../enum/user-role.enum.ts";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: UserRoles;
      };
    }
  }
}

export {};
