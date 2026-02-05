import Joi from "joi";
import type { ValidationResult } from "joi";

// forgot password

export const ForgotPasswordValidator = (data: unknown): ValidationResult =>
  Joi.object({
    email: Joi.string().email().required(),
    new_password: Joi.string().trim().min(8).required(),
    otp: Joi.string().trim().required(),
  }).validate(data, { abortEarly: false });

// verify

export const VerifyValidator = (data: unknown): ValidationResult =>
  Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
  }).validate(data, { abortEarly: false });

// resend otp

export const ResendOTPValidator = (data: unknown): ValidationResult =>
  Joi.object({
    email: Joi.string().email().required(),
  }).validate(data, { abortEarly: false });

// register

export const RegisterValidator = (data: unknown): ValidationResult =>
  Joi.object({
    username: Joi.string()
      .trim()
      .min(3)
      .max(30)
      .pattern(/^[a-zA-Z0-9 ]+$/)
      .required(),
    email: Joi.string().email().required(),
    password: Joi.string().trim().min(8).required(),
    birth_year: Joi.number()
      .integer()
      .min(1900)
      .max(new Date().getFullYear() - 16)
      .required(),
  }).validate(data, { abortEarly: false });

// login

export const LoginValidator = (data: unknown): ValidationResult =>
  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().trim().required(),
  }).validate(data, { abortEarly: false });
