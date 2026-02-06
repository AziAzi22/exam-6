import { Router, type RequestHandler } from "express";
import { authorization } from "../middleware/authorization.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
} from "../controller/product.ctr.js";
import {
  CreateProductValidatorMiddleware,
  UpdateProductValidatorMiddleware,
} from "../middleware/product-validation.middleware.js";
import { checkAdmin } from "../middleware/check-admin.js";
import { upload } from "../utils/multer.js";

const productRouter = Router();

productRouter.get(
  "/get_all_products",
  authorization,
  getAllProducts as RequestHandler,
);
productRouter.get(
  "/get_one_product/:id",
  authorization,
  getOneProduct as RequestHandler,
);
productRouter.post(
  "/add_product",
  authorization,
  checkAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "image_two", maxCount: 1 },
    { name: "image_three", maxCount: 1 },
    { name: "image_four", maxCount: 1 },
  ]),
  CreateProductValidatorMiddleware,
  createProduct as RequestHandler,
);
productRouter.put(
  "/update_product/:id",
  authorization,
  checkAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "image_two", maxCount: 1 },
    { name: "image_three", maxCount: 1 },
    { name: "image_four", maxCount: 1 },
  ]),
  UpdateProductValidatorMiddleware,
  updateProduct as RequestHandler,
);
productRouter.delete(
  "/delete_product/:id",
  authorization,
  checkAdmin,
  deleteProduct as RequestHandler,
);

export default productRouter;
