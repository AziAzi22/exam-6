import Joi from "joi";

export const changePasswordValidator = async (data: any) =>
  Joi.object({
    email: Joi.string().trim().email().required(),
    current_password: Joi.string().trim().min(8).required(),
    new_password: Joi.string().trim().min(8).required(),
    confirm_password: Joi.string().trim().min(8).required(),
  }).validateAsync(data, { abortEarly: false });

export const changeUsernameValidator = async (data: any) =>
  Joi.object({
    username: Joi.string().trim().min(3).max(30).required(),
  }).validateAsync(data, { abortEarly: false });

export const changeBirthYearValidator = async (data: any) =>
  Joi.object({
    birth_year: Joi.number()
      .min(1900)
      .max(new Date().getFullYear() - 16)
      .required(),
  }).validateAsync(data, { abortEarly: false });

export const changeEmailValidator = async (data: any) =>
  Joi.object({
    new_email: Joi.string().trim().email().required(),
    old_password: Joi.string().trim().min(8).required(),
    new_password: Joi.string().trim().min(8).required(),
    confirm_password: Joi.string().trim().min(8).required(),
  }).validateAsync(data, { abortEarly: false });
