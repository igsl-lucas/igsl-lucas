"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logwriter_1 = require("./logwriter");
require('dotenv').config();
const requestLogger = (req, res, next) => {
    const loggerDateFormat = process.env.LOGGER_DATEFORMAT || "yyyy-mm-dd";
    const start = new Date().getTime();
    res.on('finish', () => {
        const elapsed = new Date().getTime() - start;
        logwriter_1.WriteW3CLog(start, req, res, elapsed);
    });
    next();
};
exports.RequestLogger = requestLogger;
//# sourceMappingURL=requestlogger.js.map