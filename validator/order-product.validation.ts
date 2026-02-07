import Joi, { type ValidationResult } from "joi";

// buy product

export const buyProductValidator = async (
  data: unknown,
): Promise<ValidationResult> =>
  Joi.object({
    quantity: Joi.number().integer().min(1).required(),
    paymentMethod: Joi.string().trim().required(),
    adress: Joi.string().trim().required(),
  }).validate(data, { abortEarly: false });

// update  adress product

export const updateAdressOrderProductValidator = async (
  data: unknown,
): Promise<ValidationResult> =>
  Joi.object({
    adress: Joi.string().trim().min(10).required(),
  }).validate(data, { abortEarly: false });

// update  payment method product

export const updatePaymentMethodOrderProductValidator = async (
  data: unknown,
): Promise<ValidationResult> =>
  Joi.object({
    paymentMethod: Joi.string().trim().required(),
  }).validate(data, { abortEarly: false });
