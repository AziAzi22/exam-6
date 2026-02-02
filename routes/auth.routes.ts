import { Router, type RequestHandler } from "express";
import {
  forgotPassword,
  login,
  logout,
  register,
  resendOTP,
  verify,
} from "../controller/auth.ctr.js";
import { refreshToken } from "../utils/token-generator.js";

const authRouter: Router = Router();

authRouter.post("/register", register as RequestHandler);
authRouter.post("/verify", verify as RequestHandler);
authRouter.post("/login", login as RequestHandler);
authRouter.post("/resend_otp", resendOTP as RequestHandler);
authRouter.post("/forgot_password", forgotPassword as RequestHandler);
authRouter.get("/logout", logout as RequestHandler);
authRouter.get("/refresh_token", refreshToken as RequestHandler);

export default authRouter;
