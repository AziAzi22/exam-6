import type { NextFunction, Request, Response } from "express";
import logger from "../utils/logger.js";
import { Product, SavedProduct } from "../model/association.js";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";

SavedProduct.sync({ force: false });

// SAVE / UNSAVE PRODUCT

export const saveProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: productId } = req.params;

    const newId = Number(productId as string);

    const product = await Product.findByPk(newId);

    const userId = req.user!.id;
 
    if (isNaN(newId)) {
      throw CustomErrorHandler.BadRequest("Invalid product id");
    }

    if (!product) {
      throw CustomErrorHandler.NotFound("Product not found");
    }

    const exists = await SavedProduct.findOne({
      where: { productId: newId, userId },
    });

    if (exists) {
      await exists.destroy();

      return res.status(200).json({
        message: "Product removed from saved",
      });
    }

    await SavedProduct.create({
      productId: newId,
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
          as: "fk_productId_savedProduct_belongs",
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
