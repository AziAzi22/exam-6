import type { NextFunction, Request, Response } from "express";
import logger from "../utils/logger.js";
import type { CreateProductDTO, UpdateProductDTO } from "../dto/product.dto.js";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";
import { Product } from "../model/association.js";
import { Op } from "sequelize";
import { getPagination } from "../utils/pagination.js";
import { removeFile } from "../utils/file-remove.js";

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

    const exists = await Product.findOne({
      where: {
        title: title,
      },
    });

    if (exists) {
      throw CustomErrorHandler.AlreadyExist("product already exists");
    }

    const files = req.files as { [fieldName: string]: Express.Multer.File[] };

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
    const { page, limit, offset } = getPagination(req);

    const search = (req.query.search as string)?.trim() || "";

    let whereClause: any = {};

    if (search) {
      whereClause = {
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ],
      };
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    const totalPage = Math.ceil(count / limit);

    res.status(200).json({
      totalPage,
      currentPage: page,
      totalItems: count,

      prev: page > 1 ? { page: page - 1, limit } : null,

      next: totalPage > page ? { page: page + 1, limit } : null,

      data: products,
    });
  } catch (error: unknown) {
    logger.error("Get all products error: " + (error as Error).message);
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

    let imageOneUrl = product.dataValues.imageOneUrl;

    if (files?.["image"]?.[0]) {
      removeFile(product.dataValues.imageOneUrl);
      imageOneUrl = "/upload/images/" + files["image"][0].filename;
    }

    let imageTwoUrl = product.dataValues.imageTwoUrl;

    if (files?.["image_two"]?.[0]) {
      removeFile(product.dataValues.imageTwoUrl);
      imageTwoUrl = "/upload/images/" + files["image_two"][0].filename;
    }

    let imageThreeUrl = product.dataValues.imageThreeUrl;

    if (files?.["image_three"]?.[0]) {
      removeFile(product.dataValues.imageThreeUrl);
      imageThreeUrl = "/upload/images/" + files["image_three"][0].filename;
    }

    let imageFourUrl = product.dataValues.imageFourUrl;

    if (files?.["image_four"]?.[0]) {
      removeFile(product.dataValues.imageFourUrl);
      imageFourUrl = "/upload/images/" + files["image_four"][0].filename;
    }

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

    removeFile(product.dataValues.imageOneUrl);
    removeFile(product.dataValues.imageTwoUrl);
    removeFile(product.dataValues.imageThreeUrl);
    removeFile(product.dataValues.imageFourUrl);

    await product.destroy();

    logger.info(`Product deleted: id=${id}`);

    res.status(200).json({ message: "product deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Delete product error:" + message);

    next(error);
  }
};
