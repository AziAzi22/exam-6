import type { NextFunction, Request, Response } from "express";
import { Category } from "../model/category.models.js";
import logger from "../utils/logger.js";
import {
  CreateCategoryValidator,
  UpdateCategoryValidator,
} from "../validator/category.validation.js";
import type {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../dto/category.dto.js";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";
import { Product } from "../model/product.model.js";

Category.sync({ force: false });

// create category

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { error, value } = await CreateCategoryValidator(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const exists = await Category.findOne({
      where: {
        title: value.body.title,
      },
    });

    if (exists) {
      throw CustomErrorHandler.AlreadyExist("category already exists");
    }

    const { title, imageUrl, adminId } = value.body as CreateCategoryDTO;

    await Category.create({ title, imageUrl, adminId });

    res.status(201).json({ message: "category created" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Create category error:" + message);

    next(error);
  }
};

/// get all categories

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const categories = await Category.findAll();

    res.status(200).json(categories);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Get all categories error:" + message);

    next(error);
  }
};

/// get one category

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { id } = req.params;

    const newID = Number(id as string);

    const category = await Category.findByPk(newID);

    if (!category) {
      throw CustomErrorHandler.NotFound("category not found");
    }

    const products = await Product.findAll({
      where: {
        categoryId: newID,
      },
    });

    res.status(200).json(products);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Get category by id error:" + message);

    next(error);
  }
};

/// update category

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { id } = req.params;

    const newID = Number(id as string);

    const category = await Category.findByPk(newID);

    if (!category) {
      throw CustomErrorHandler.NotFound("category not found");
    }

    const { error, value } = await UpdateCategoryValidator(req.body);

    if (error) {
      throw CustomErrorHandler.BadRequest(error.message);
    }

    const { title, imageUrl } = value.body as UpdateCategoryDTO;

    await category.update({ title, imageUrl });

    res.status(200).json({ message: "category updated" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Update category error:" + message);

    next(error);
  }
};

// delete category

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { id } = req.params;

    const newID = Number(id as string);

    const category = await Category.findByPk(newID);

    if (!category) {
      throw CustomErrorHandler.NotFound("category not found");
    }

    await category.destroy();

    logger.info(`Category deleted: id=${id}`);

    res.status(200).json({ message: "category deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Delete category error:" + message);

    next(error);
  }
};
