import Joi from "joi";
import type { ValidationResult } from "joi";

/// create category

export const CreateCategoryValidator = async (
  data: unknown,
): Promise<ValidationResult> =>
  Joi.object({
    title: Joi.string().trim().min(2).max(30).required(),
    imageUrl: Joi.string().trim().required(),
    adminId: Joi.number().integer().required(),
  }).validate(data, { abortEarly: false });

// update category

export const UpdateCategoryValidator = async (
  data: unknown,
): Promise<ValidationResult> =>
  Joi.object({
    title: Joi.string().trim().min(2).max(30).required(),
    imageUrl: Joi.string().trim().required(),
  }).validate(data, { abortEarly: false });

