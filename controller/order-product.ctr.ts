import type { NextFunction, Request, Response } from "express";
import { OrderProduct, Product } from "../model/association.js";
import logger from "../utils/logger.js";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";
import type { BuyProductDTO } from "../dto/order-product.dto.js";
import { buyProductValidator } from "../validator/order-product.validation.js";

OrderProduct.sync({ force: false });

// buy product

export const buyPoduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { id } = req.params;

    const newID = Number(id as string);

    if (isNaN(newID)) {
      throw CustomErrorHandler.BadRequest("Invalid product id");
    }

    const { error, value } = await buyProductValidator(req.body);

    if (error) {
      throw CustomErrorHandler.BadRequest(error.message);
    }

    const { paymentMethod, quantity, adress } = value as BuyProductDTO;

    const userId = req.user!.id;

    const foundedProduct = await Product.findOne({
      where: {
        productId: newID,
      },
    });

    if (!foundedProduct) {
      throw CustomErrorHandler.NotFound("Product not found");
    }
    const totalPrice = foundedProduct.price * quantity;

    OrderProduct.create({
      userId: userId,
      productId: newID,
      quantity: quantity,
      totalPrice: totalPrice,
      paymentMethod: paymentMethod,
      status: "pending",
      adress: adress,
    });

    res.status(200).json({ message: "Product bought" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Buy product error:" + message);

    next(error);
  }
};
