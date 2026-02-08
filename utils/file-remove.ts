import fs from "fs";
import path from "path";
import logger from "./logger.js";

export const removeFile = (filePath?: string | null) => {
  try {
    if (!filePath) return;

    const fullPath = path.join(process.cwd(), filePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      logger.info("File removed: " + filePath);
    }
  } catch (error) {
    logger.error("File remove error: " + String(error));
  }
};
