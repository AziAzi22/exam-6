import { createLogger, format, transports } from "winston";
import Transport from "winston-transport";
import sequelize from "../config/config.js";
import { QueryTypes } from "sequelize";

const { combine, timestamp, printf, colorize } = format;

class PostgresTransport extends Transport {
  constructor(opts?: any) {
    super(opts);
  }

  async log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    try {
      await sequelize.query(
        'INSERT INTO logs (level, message, timestamp) VALUES (:level, :message, :timestamp)',
        {
          replacements: {
            level: info.level,
            message: info.message,
            timestamp: info.timestamp || new Date(),
          },
          type: QueryTypes.INSERT,
        }
      );
    } catch (err) {
      console.error("Failed to write log to PG:", err);
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
