"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const winston_1 = require("winston");
const uuid_1 = tslib_1.__importDefault(require("./uuid"));
const addToInfo = winston_1.format((info) => (Object.assign(Object.assign({}, info), { application: "jira-data-sucker", environment: process.env.NODE_ENV, sessionId: uuid_1.default(), timestamp: new Date(Date.now()).toISOString() })));
const logger = winston_1.createLogger({
    format: winston_1.format.json(),
    level: "info"
});
logger.add(new winston_1.transports.Console({
    format: winston_1.format.combine(addToInfo(), winston_1.format.json()),
    level: "debug"
}));
exports.default = logger;
//# sourceMappingURL=logger.js.map