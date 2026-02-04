import Joi, { type ValidationResult } from "joi";

// create product

export const CreateProductValidator = async (
  data: unknown,
): Promise<ValidationResult> =>
  Joi.object({
    title: Joi.string().trim().min(2).max(100).required(),
    price: Joi.number().min(0).required(),
    quantity: Joi.number().integer().min(0).required(),
    description: Joi.string().trim().max(2000).allow(null, ""),
    imageOneUrl: Joi.string().trim().required(),
    imageTwoUrl: Joi.string().trim().optional(),
    imageThreeUrl: Joi.string().trim().optional(),
    imageFourUrl: Joi.string().trim().optional(),
    categoryId: Joi.number().integer().required(),
    adminId: Joi.number().integer().required(),
  }).validate(data, { abortEarly: false });

// update product

export const UpdateProductValidator = async (
  data: unknown,
): Promise<ValidationResult> =>
  Joi.object({
    title: Joi.string().trim().min(2).max(100).optional(),
    price: Joi.number().min(0).optional(),
    quantity: Joi.number().integer().min(0).optional(),
    description: Joi.string().trim().max(2000).allow(null, ""),
    imageOneUrl: Joi.string().trim().optional(),
    imageTwoUrl: Joi.string().trim().optional(),
    imageThreeUrl: Joi.string().trim().optional(),
    imageFourUrl: Joi.string().trim().optional(),
    categoryId: Joi.number().integer().optional(),
  }).validate(data, { abortEarly: false });
