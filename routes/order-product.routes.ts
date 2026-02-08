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
import { authorization } from "../middleware/authorization.js";

const orderProductRouter: Router = Router();

orderProductRouter.get("/get_all_orders",  authorization, getAllOrders as RequestHandler);

orderProductRouter.patch("/delivered/:id",  authorization, deliveredProduct as RequestHandler);

orderProductRouter.post(
  "/buy_product/:id",
  authorization,
  buyProductValidatorMiddleware,
  buyPoduct as RequestHandler,
);

orderProductRouter.patch(
  "/cancel_order/:id",
    authorization,
  cancelOrderProduct as RequestHandler,
);

orderProductRouter.patch(
  "/update_adress/:id",
    authorization,
  updateAdressOrderProductValidatorMiddleware,
  updateAdressOrderProduct as RequestHandler,
);

orderProductRouter.patch(
  "/update_payment_method/:id",
    authorization,
  updatePaymentMethodOrderProductValidatorMiddleware,
  updatePaymentMethodOrderProduct as RequestHandler,
);

export default orderProductRouter;
