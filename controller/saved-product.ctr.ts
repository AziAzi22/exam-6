// SAVE / UNSAVE PRODUCT

import type { NextFunction, Request, Response } from "express";
import logger from "../utils/logger.js";
import { SavedProduct } from "../model/saved.product.js";
import { Product } from "../model/product.model.js";

SavedProduct.sync({ force: false });

/// save product

export const saveProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: productId } = req.params;

    const userId = req.user!.id;

    const exists = await SavedProduct.findOne({
      where: { productId, userId },
    });

    if (exists) {
      await exists.destroy();

      return res.status(200).json({
        message: "Product removed from saved",
      });
    }

    await SavedProduct.create({
      productId: Number(productId),
      userId,
    });

    logger.info("Product saved", { productId, userId });

    res.status(200).json({
      message: "Product saved",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Save product error:" + message);

    next(error);
  }
};

/// get saved products

export const getSavedProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;

    const saved = await SavedProduct.findAll({
      where: { userId },
      include: [
        {
          model: Product,
        },
      ],
    });

    res.status(200).json(saved);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("get saved products error:" + message);

    next(error);
  }
};
