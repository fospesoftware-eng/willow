import { logger } from "./lib/logger";

const log = (level: "info" | "warn" | "error") => (message: unknown, ..._details: unknown[]) => {
  // Do not record customer information or provider credentials from legacy handlers.
  logger[level](String(message));
};
export const migrationLogger = { info: log("info"), log: log("info"), warn: log("warn"), error: log("error") };
