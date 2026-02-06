import Joi from "joi";

// change password

export const changePasswordValidator = async (data: unknown) =>
  Joi.object({
    current_password: Joi.string().trim().min(8).required(),
    new_password: Joi.string().trim().min(8).required(),
    confirm_password: Joi.string().trim().min(8).required(),
  }).validateAsync(data, { abortEarly: false });

// change username

export const changeUsernameValidator = async (data: unknown) =>
  Joi.object({
    username: Joi.string().trim().min(3).max(30).required(),
  }).validateAsync(data, { abortEarly: false });

// change birth year

export const changeBirthYearValidator = async (data: unknown) =>
  Joi.object({
    birth_year: Joi.number()
      .min(1900)
      .max(new Date().getFullYear() - 16)
      .required(),
  }).validateAsync(data, { abortEarly: false });

// change email

export const changeEmailValidator = async (data: unknown) =>
  Joi.object({
    new_email: Joi.string().trim().email().required(),
    old_password: Joi.string().trim().min(8).required(),
    new_password: Joi.string().trim().min(8).required(),
    confirm_password: Joi.string().trim().min(8).required(),
  }).validateAsync(data, { abortEarly: false });

// change userpic

export const changeUserpicValidator = async (data: unknown) =>
  Joi.object({}).validateAsync(data, { abortEarly: false });

// change adress

export const changeAdressValidator = async (data: unknown) =>
  Joi.object({
    adress: Joi.string().trim().min(10).required(),
  }).validateAsync(data, { abortEarly: false });
