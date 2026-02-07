import type { NextFunction, Request, Response } from "express";
import { OrderProduct, Product } from "../model/association.js";
import logger from "../utils/logger.js";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";
import type {
  BuyProductDTO,
  updateAdressOrderProductDTO,
  updatePaymentMethodOrderProductDTO,
} from "../dto/order-product.dto.js";

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

    const { paymentMethod, quantity, adress } = req.body as BuyProductDTO;

    const userId = req.user!.id;

    const foundedProduct = await Product.findOne({
      where: { id: newID },
    });

    if (!foundedProduct) {
      throw CustomErrorHandler.NotFound("Product not found");
    }

    if (foundedProduct.quantity < quantity) {
      throw CustomErrorHandler.BadRequest("Not enough products in stock");
    }

    const totalPrice = foundedProduct.price * quantity;

    await OrderProduct.create({
      userId: userId,
      productId: newID,
      quantity: quantity,
      totalPrice: totalPrice,
      paymentMethod: paymentMethod,
      status: "pending",
      adress: adress,
    });

    await Product.update(
      { quantity: foundedProduct.quantity - quantity },
      { where: { id: newID } },
    );

    res.status(200).json({ message: "Product bought" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Buy product error:" + message);

    next(error);
  }
};

// get all orders

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const user = req.user!;

    const orders = await OrderProduct.findAll({
      where: {
        userId: user.id,
      },
    });

    res.status(200).json(orders);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Get all orders error:" + message);

    next(error);
  }
};

// cancel Order Product

export const cancelOrderProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;

    const { id } = req.params;

    const newID = Number(id as string);

    if (isNaN(newID)) {
      throw CustomErrorHandler.BadRequest("Invalid product id");
    }

    const orderProduct = await OrderProduct.findOne({
      where: {
        id: newID,
        userId,
      },
    });

    if (!orderProduct) {
      throw CustomErrorHandler.NotFound("Order product not found");
    }

    if (orderProduct.status !== "pending") {
      throw CustomErrorHandler.BadRequest("You can cancel only pending orders");
    }

    const product = await Product.findOne({
      where: { id: orderProduct.productId },
    });

    await Product.update(
      {
        quantity: product!.quantity + orderProduct.quantity,
      },
      { where: { id: orderProduct.productId } },
    );

    await OrderProduct.update(
      {
        status: "canceled",
      },
      {
        where: {
          id: newID,
        },
      },
    );

    res.status(200).json({
      message: "Order product canceled",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Cancel order product error:" + message);

    next(error);
  }
};

// delivered product

export const deliveredProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;

    const { id } = req.params;

    const newID = Number(id as string);

    if (isNaN(newID)) {
      throw CustomErrorHandler.BadRequest("Invalid product id");
    }

    const orderProduct = await OrderProduct.findOne({
      where: {
        id: newID,
        userId,
      },
    });

    if (!orderProduct) {
      throw CustomErrorHandler.NotFound("Order product not found");
    }

    await orderProduct.update({ status: "delivered" });

    res.status(200).json({ message: "Order product delivered" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Update status order product error:" + message);

    next(error);
  }
};

// update Adress Order Product

export const updateAdressOrderProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;

    const { id } = req.params;

    const newID = Number(id as string);

    if (isNaN(newID)) {
      throw CustomErrorHandler.BadRequest("Invalid product id");
    }

    const orderProduct = await OrderProduct.findOne({
      where: {
        id: newID,
        userId,
      },
    });

    if (!orderProduct) {
      throw CustomErrorHandler.NotFound("Order product not found");
    }

    if (orderProduct.status !== "pending") {
      throw CustomErrorHandler.BadRequest(
        "You can update order only when status is pending",
      );
    }

    const { adress } = req.body as updateAdressOrderProductDTO;

    await orderProduct.update({
      adress: adress,
    });

    res.status(200).json({
      message: "Adress updated",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Update adress order product error:" + message);

    next(error);
  }
};

// update Payment Method Order Product

export const updatePaymentMethodOrderProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;

    const { id } = req.params;

    const newID = Number(id as string);

    if (isNaN(newID)) {
      throw CustomErrorHandler.BadRequest("Invalid product id");
    }

    const orderProduct = await OrderProduct.findOne({
      where: {
        id: newID,
        userId,
      },
    });

    if (!orderProduct) {
      throw CustomErrorHandler.NotFound("Order product not found");
    }

    if (orderProduct.status !== "pending") {
      throw CustomErrorHandler.BadRequest(
        "You can update order only when status is pending",
      );
    }

    const { paymentMethod } = req.body as updatePaymentMethodOrderProductDTO;

    await orderProduct.update({
      paymentMethod: paymentMethod,
    });

    res.status(200).json({
      message: "Payment method updated",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Update payment method product error:" + message);

    next(error);
  }
};
