import { createLogger, format, transports } from "winston";
import Transport from "winston-transport";
import { Logger } from "../model/logger.model.js";

const { combine, timestamp, printf, colorize } = format;

class PostgresTransport extends Transport {
  async log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    try {
      await Logger.create({
        level: info.level,
        message: info.message,
        timestamp: info.timestamp || new Date(),
      });
    } catch (err) {
      console.error("Failed to write log via Sequelize:", err);
    }

    callback();
  }
}

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  level: "debug",
  format: combine(timestamp(), colorize(), myFormat),
  transports: [
    new transports.Console(),
    new PostgresTransport(),
  ],
});

export default logger;
