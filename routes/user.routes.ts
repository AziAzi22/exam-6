import { Router, type RequestHandler } from "express";
import { authorization } from "../middleware/authorization.js";
import {
  changeAdress,
  changeBirthYear,
  changeEmail,
  changePassword,
  changeUsername,
  changeUserpic,
  getProfile,
} from "../controller/user.ctr.js";

const userRouter: Router = Router();

userRouter.get("/get_profile", authorization, getProfile as RequestHandler);
userRouter.patch(
  "/change_username",
  authorization,
  changeUsername as RequestHandler,
);
userRouter.patch(
  "/change_birth_year",
  authorization,
  changeBirthYear as RequestHandler,
);
userRouter.patch(
  "/change_password",
  authorization,
  changePassword as RequestHandler,
);
userRouter.patch(
  "/change_userpic",
  authorization,
  changeUserpic as RequestHandler,
);
userRouter.patch(
  "/change_adress",
  authorization,
  changeAdress as RequestHandler,
);
userRouter.patch("/change_email", authorization, changeEmail as RequestHandler);

export default userRouter;
