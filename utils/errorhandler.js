"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
exports.HTTPStatus = http_status_codes_1.default;
const http_errors_1 = __importDefault(require("http-errors"));
const logwriter_1 = require("./logwriter");
const common_model_1 = require("../common/common.model");
const commonutil_1 = require("./commonutil");
const notFoundHandler = (req, res, next) => {
    const moduleName = "API - General";
    next(createErr(http_status_codes_1.default.NOT_FOUND, `Request URL ${req.originalUrl} not found`, moduleName));
};
exports.NotFoundHandler = notFoundHandler;
const createErr = (statusCode, message, source) => {
    let finalmessage = message || http_status_codes_1.default.getStatusText(statusCode);
    let finalsource = source || "<unknown>";
    return (http_errors_1.default(statusCode, finalmessage, { "source": `${finalsource}` }));
};
exports.CreateErr = createErr;
const errHandler = (err, req, resp, next) => {
    logwriter_1.WriteSysLog(logwriter_1.LogLevel.error, err["source"], err.message);
    if (resp.locals.eventMessage && resp.locals.eventModule) {
        const eventLevel = (err.statusCode >= 500) ? logwriter_1.LogLevel.error : logwriter_1.LogLevel.warn;
        commonutil_1.AppendOpLogMessage(resp, common_model_1.EventResult.failed);
        commonutil_1.AppendOpLogMessage(resp, "Details:");
        commonutil_1.AppendOpLogMessage(resp, err.message);
        logwriter_1.WriteOpLogResp(eventLevel, resp);
    }
    resp.status(err.status).json({ "message": `${err.message}` });
};
exports.ErrHandler = errHandler;
//# sourceMappingURL=errorhandler.js.map