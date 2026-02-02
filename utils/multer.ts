import type { Request } from "express";
import multer from "multer";
import { extname } from "path";

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const uniqueName = file.fieldname + "_" + Date.now();
    const ext = extname(file.originalname);
    cb(null, `${uniqueName}${ext}`);
  },
});

export const upload = multer({ storage });
