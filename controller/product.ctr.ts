import type { NextFunction, Request, Response } from "express";
import { Product } from "../model/product.model.js";
import logger from "../utils/logger.js";
import {
  CreateProductValidator,
  UpdateProductValidator,
} from "../validator/product.validation.js";
import type { CreateProductDTO, UpdateProductDTO } from "../dto/product.dto.js";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";

Product.sync({ force: false });

// create product

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { error, value } = await CreateProductValidator(req.body);

    if (error) {
      throw CustomErrorHandler.BadRequest(error.message);
    }

    const {
      title,
      price,
      quantity,
      description,
      imageOneUrl,
      imageTwoUrl,
      imageThreeUrl,
      imageFourUrl,
      categoryId,
      adminId,
    } = value.body as CreateProductDTO;

    const exists = await Product.findOne({
      where: {
        title: value.title,
      },
    });

    if (exists) {
      throw CustomErrorHandler.AlreadyExist("product already exists");
    }

    await Product.create({
      title,
      price,
      quantity,
      description,
      imageOneUrl,
      imageTwoUrl,
      imageThreeUrl,
      imageFourUrl,
      categoryId,
      adminId,
    });

    res.status(201).json({
      message: "product created",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Create product error:" + message);

    next(error);
  }
};

// get one products

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { id } = req.params;

    const newID = Number(id as string);

    const product = await Product.findByPk(newID);

    if (!product) {
      throw CustomErrorHandler.NotFound("product not found");
    }

    res.status(200).json(product);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Get product by id error:" + message);

    next(error);
  }
};

// update product

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { id } = req.params;

    const newID = Number(id as string);

    const product = await Product.findByPk(newID);

    if (!product) {
      throw CustomErrorHandler.NotFound("product not found");
    }

    const { error, value } = await UpdateProductValidator(req.body);

    if (error) {
      throw CustomErrorHandler.BadRequest(error.message);
    }

    const {
      title,
      price,
      quantity,
      description,
      imageOneUrl,
      imageTwoUrl,
      imageThreeUrl,
      imageFourUrl,
      categoryId,
    } = value.body as UpdateProductDTO;

    await product.update({
      title,
      price,
      quantity,
      description,
      imageOneUrl,
      imageTwoUrl,
      imageThreeUrl,
      imageFourUrl,
      categoryId,
    });

    res.status(200).json({
      message: "product updated",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Update product error:" + message);

    next(error);
  }
};

// delete product

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { id } = req.params;

    const newID = Number(id as string);

    const product = await Product.findByPk(newID);

    if (!product) {
      throw CustomErrorHandler.NotFound("product not found");
    }

    await product.destroy();

    logger.info(`Product deleted: id=${id}`);

    res.status(200).json({ message: "product deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Delete product error:" + message);

    next(error);
  }
};
