import type { NextFunction, Request, Response } from "express";
import logger from "../utils/logger.js";
import type {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../dto/category.dto.js";
import { CustomErrorHandler } from "../utils/custom-error-handler.js";
import { Category, Product } from "../model/association.js";
import { getPagination } from "../utils/pagination.js";
import { Op } from "sequelize";
import { removeFile } from "../utils/file-remove.js";

Category.sync({ force: false });

// create category

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { title } = req.body as CreateCategoryDTO;

    const exists = await Category.findOne({
      where: {
        title: title,
      },
    });

    if (exists) {
      throw CustomErrorHandler.AlreadyExist("category already exists");
    }

    if (!req.file) {
      throw CustomErrorHandler.BadRequest("image file is required");
    }

    const path = "/upload/images/" + req.file.filename;

    const adminId = req.user!.id;

    await Category.create({ title, imageUrl: path, adminId });

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

export const getOneCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const newID = Number(id);

    if (isNaN(newID)) {
      throw CustomErrorHandler.BadRequest("Invalid category id");
    }

    const category = await Category.findByPk(newID);

    if (!category) {
      throw CustomErrorHandler.NotFound("category not found");
    }

    const { page, limit, offset } = getPagination(req);

    const search = (req.query.search as string)?.trim() || "";

    let whereClause: any = {
      categoryId: newID,
    };

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    const totalPage = Math.ceil(count / limit);

    res.status(200).json({
      category: {
        id: category.id,
        name: category.title,
      },

      totalPage,
      currentPage: page,
      totalItems: count,

      prev: page > 1 ? { page: page - 1, limit } : null,

      next: totalPage > page ? { page: page + 1, limit } : null,

      data: products,
    });
  } catch (error: unknown) {
    logger.error("Get category by id error: " + (error as Error).message);
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

    const { title } = req.body as UpdateCategoryDTO;

    let path = category.imageUrl;

    if (req.file) {
      removeFile(category.imageUrl);

      path = "/upload/images/" + req.file.filename;
    }

    await category.update({ title, imageUrl: path });

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

    removeFile(category.imageUrl);

    await category.destroy();

    logger.info(`Category deleted: id=${id}`);

    res.status(200).json({ message: "category deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Delete category error:" + message);

    next(error);
  }
};
