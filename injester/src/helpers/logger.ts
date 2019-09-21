import { createLogger, format, transports } from "winston";
import generateUUID from "./uuid";

const addToInfo = format((info) => ({
  ...info,
  application: "jira-data-sucker",
  environment: process.env.NODE_ENV,
  sessionId: generateUUID(),
  timestamp: new Date(Date.now()).toISOString()
}));

const logger = createLogger({
  format: format.json(),
  level: "info"
});

logger.add(
  new transports.Console({
    format: format.combine(addToInfo(), format.json()),
    level: "debug"
  })
);

export default logger;
