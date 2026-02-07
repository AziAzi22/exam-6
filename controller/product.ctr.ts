import type { NextFunction, Request, Response } from "express";
import logger from "../utils/logger.js";
import type { CreateProductDTO, UpdateProductDTO } from "../dto/product.dto.js";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";
import { Product } from "../model/association.js";

Product.sync({ force: false });

// create product

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {


    const { title, price, quantity, description, categoryId } =
      req.body as CreateProductDTO;

    const adminId = req.user!.id;

    const files = req.files as { [fieldName: string]: Express.Multer.File[] };

    const exists = await Product.findOne({
      where: {
        title: title,
      },
    });

    if (exists) {
      throw CustomErrorHandler.AlreadyExist("product already exists");
    }

    if (!files || !files["image"]?.length) {
      throw CustomErrorHandler.BadRequest("at least one image is needed");
    }

    const imageOneUrl = "/upload/images/" + files["image"][0]?.filename;
    const imageTwoUrl = files["image_two"]?.[0]?.filename
      ? "/upload/images/" + files["image_two"][0].filename
      : null;
    const imageThreeUrl = files["image_three"]?.[0]?.filename
      ? "/upload/images/" + files["image_three"][0].filename
      : null;
    const imageFourUrl = files["image_four"]?.[0]?.filename
      ? "/upload/images/" + files["image_four"][0].filename
      : null;

    await Product.create({
      title,
      price,
      quantity,
      description,
      categoryId,
      adminId,
      imageOneUrl,
      imageTwoUrl,
      imageThreeUrl,
      imageFourUrl,
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

// get all products

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const products = await Product.findAll();

    res.status(200).json(products);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Get all products error:" + message);

    next(error);
  }
};

// get one products

export const getOneProduct = async (
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


    const { title, price, quantity, description, categoryId } =
      req.body as UpdateProductDTO;

    const files = req.files as
      | { [fieldName: string]: Express.Multer.File[] }
      | undefined;

    const imageOneUrl = files?.["image"]?.[0]?.filename
      ? "/upload/images/" + files["image"][0].filename
      : product.imageOneUrl;

    const imageTwoUrl = files?.["image_two"]?.[0]?.filename
      ? "/upload/images/" + files["image_two"][0].filename
      : product.imageTwoUrl;

    const imageThreeUrl = files?.["image_three"]?.[0]?.filename
      ? "/upload/images/" + files["image_three"][0].filename
      : product.imageThreeUrl;

    const imageFourUrl = files?.["image_four"]?.[0]?.filename
      ? "/upload/images/" + files["image_four"][0].filename
      : product.imageFourUrl;

    await product.update({
      title,
      price,
      quantity,
      description,
      categoryId,
      imageOneUrl,
      imageTwoUrl,
      imageThreeUrl,
      imageFourUrl,
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
