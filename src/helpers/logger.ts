import { TransformableInfo, format } from "logform";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.json()
);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
    new DailyRotateFile({
      filename: "logs/%DATE%-combined.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
    new DailyRotateFile({
      filename: "logs/%DATE%-error.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "error",
    }),
  ],
});

const consoleLogFormat = format.printf((info: TransformableInfo) => {
  const { timestamp, level, message, ...meta } = info;
  return `${timestamp} [${level.toUpperCase()}]: ${message} ${
    Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
  }`;
});

logger.transports[0].format = consoleLogFormat;

export default logger;
