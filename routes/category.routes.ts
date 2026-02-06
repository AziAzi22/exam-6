import { Router, type RequestHandler } from "express";
import { authorization } from "../middleware/authorization.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getOneCategory,
  updateCategory,
} from "../controller/category.ctr.js";
import {
  CreateCategoryValidatorMiddleware,
  UpdateCategoryValidatorMiddleware,
} from "../middleware/category-validation.middleware.js";
import { superAdmin } from "../middleware/superadmin.js";
import { checkAdmin } from "../middleware/check-admin.js";
import { upload } from "../utils/multer.js";

const categoryRouter = Router();

categoryRouter.get(
  "/get_all_categories",
  authorization,
  getAllCategories as RequestHandler,
);
categoryRouter.get(
  "/get_one_category/:id",
  authorization,
  getOneCategory as RequestHandler,
);
categoryRouter.post(
  "/add_category",
  upload.single("image"),
  authorization,
  checkAdmin,
  CreateCategoryValidatorMiddleware,
  createCategory as RequestHandler,
);
categoryRouter.put(
  "/update_category/:id",
  upload.single("image"),
  authorization,
  checkAdmin,
  UpdateCategoryValidatorMiddleware,
  updateCategory as RequestHandler,
);
categoryRouter.delete(
  "/delete_category/:id",
  authorization,
  superAdmin,
  deleteCategory as RequestHandler,
);

export default categoryRouter;
