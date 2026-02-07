import { Router, type RequestHandler } from "express";
import {
  buyPoduct,
  cancelOrderProduct,
  deliveredProduct,
  getAllOrders,
  updateAdressOrderProduct,
  updatePaymentMethodOrderProduct,
} from "../controller/order-product.ctr.js";
import {
  buyProductValidatorMiddleware,
  updateAdressOrderProductValidatorMiddleware,
  updatePaymentMethodOrderProductValidatorMiddleware,
} from "../middleware/order-product.validation.middleware.js";

const orderProductRouter: Router = Router();

orderProductRouter.get("/get_all_orders", getAllOrders as RequestHandler);

orderProductRouter.patch("/delivered/:id", deliveredProduct as RequestHandler);

orderProductRouter.post(
  "/buy_product/:id",
  buyProductValidatorMiddleware,
  buyPoduct as RequestHandler,
);

orderProductRouter.patch(
  "/cancel_order/:id",
  cancelOrderProduct as RequestHandler,
);

orderProductRouter.patch(
  "/update_adress/:id",
  updateAdressOrderProductValidatorMiddleware,
  updateAdressOrderProduct as RequestHandler,
);

orderProductRouter.patch(
  "/update_payment_method/:id",
  updatePaymentMethodOrderProductValidatorMiddleware,
  updatePaymentMethodOrderProduct as RequestHandler,
);

export default orderProductRouter;
