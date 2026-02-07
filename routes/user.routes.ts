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

import { upload } from "../utils/multer.js";
import {
  changeAdressValidatorMiddleware,
  changeBirthYearValidatorMiddleware,
  changeEmailValidatorMiddleware,
  changePasswordValidatorMiddleware,
  changeUsernameValidatorMiddleware,
} from "../middleware/user-validation.middleware.js";

const userRouter: Router = Router();

userRouter.get("/get_profile", authorization, getProfile as RequestHandler);

userRouter.patch(
  "/change_username",
  authorization,
  changeUsernameValidatorMiddleware,
  changeUsername as RequestHandler,
);

userRouter.patch(
  "/change_birth_year",
  authorization,
  changeBirthYearValidatorMiddleware,
  changeBirthYear as RequestHandler,
);

userRouter.patch(
  "/change_password",
  authorization,
  changePasswordValidatorMiddleware,
  changePassword as RequestHandler,
);

userRouter.patch(
  "/change_email",
  authorization,
  changeEmailValidatorMiddleware,
  changeEmail as RequestHandler,
);

userRouter.patch(
  "/change_userpic",
  authorization,
  upload.single("userpic"),
  changeUserpic as RequestHandler,
);

userRouter.patch(
  "/change_adress",
  authorization,
  changeAdressValidatorMiddleware,
  changeAdress as RequestHandler,
);

export default userRouter;
