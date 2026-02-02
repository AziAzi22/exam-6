import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import { CustomErrorHandler } from "./custom-error-handler.js";

export const sendMessage = async (email: string, code: string) => {
  if (!process.env.APP_KEY) {
    throw CustomErrorHandler.BadRequest("APP_KEY is not defined in .env");
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "aziazi22t@gmail.com",
        pass: process.env.APP_KEY as string,
      },
    });

    return await transporter.sendMail({
      from: "aziazi22t@gmail.com",
      to: email,
      subject: "najot market verification code",
      text: "---⚡⚡⚡---|||||---⚡⚡⚡---",
      html: `<h1><b>${code}</b></h1><br><h3><b>you have 5 minutes to verify</b></h3>`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw CustomErrorHandler.BadRequest(message);
  }
};
