"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const dotenv_1 = require("dotenv");
const dateformat_1 = __importDefault(require("dateformat"));
const opevent_model_1 = require("../models/opevent.model");
const common_model_1 = require("../common/common.model");
exports.LogLevel = common_model_1.LogLevel;
dotenv_1.config();
const w3cLogDTFormat = 'yyyy-mm-dd HH:MM:ss';
const sysLogDTFormat = 'yyyy-mm-dd HH:MM:ss';
const { timestamp, printf } = winston_1.format;
const syslogFormat = printf(({ level, message, timestamp }) => {
    return `${level}: ${dateformat_1.default(timestamp, sysLogDTFormat)} ${message}`;
});
const w3clogFormat = printf(({ level, message, timestamp }) => {
    return `${message}`;
});
const WriteErrLog = (module, method, error) => __awaiter(void 0, void 0, void 0, function* () {
    yield WriteSysLog(common_model_1.LogLevel.error, `${module} (${method})`, error.message);
});
exports.WriteErrLog = WriteErrLog;
const WriteSysLog = (level, source, message) => __awaiter(void 0, void 0, void 0, function* () {
    const logger = winston_1.createLogger({
        transports: [
            new winston_1.transports.Console({
                level: common_model_1.LogLevel.silly,
                format: winston_1.format.combine(winston_1.format.timestamp(), syslogFormat)
            }),
            new winston_1.transports.File({
                level: common_model_1.LogLevel.warn,
                filename: `${process.env.ERRLOG_FOLDER}/System.log`,
                format: winston_1.format.combine(winston_1.format.timestamp(), syslogFormat)
            })
        ]
    });
    logger.log(level, `[${source}] ${message}`);
});
exports.WriteSysLog = WriteSysLog;
const WriteW3CLog = (recdDate, req, resp, timeElapsed) => __awaiter(void 0, void 0, void 0, function* () {
    let w3clogFilename = dateformat_1.default(recdDate, 'yyyymmdd');
    const logger = winston_1.createLogger({
        transports: [
            new winston_1.transports.File({
                level: common_model_1.LogLevel.http,
                filename: `${process.env.W3CLOG_FOLDER}/${w3clogFilename}.log`,
                format: winston_1.format.combine(winston_1.format.timestamp(), w3clogFormat)
            })
        ]
    });
    logger.log(common_model_1.LogLevel.http, `${dateformat_1.default(recdDate, w3cLogDTFormat)} ${req.connection.remoteAddress} ${req.method} ${req.originalUrl.toLowerCase()} ${resp.statusCode} ${req.httpVersion} ${timeElapsed}ms`);
});
exports.WriteW3CLog = WriteW3CLog;
const WriteOpLog = (level, source, user = undefined, message = '') => __awaiter(void 0, void 0, void 0, function* () {
    let event = new opevent_model_1.OpEvent({
        level: level,
        source: source,
        recorddt: Date.now(),
        user: user,
        message: message
    });
    try {
        yield event.save();
        WriteSysLog(common_model_1.LogLevel.info, source, message);
    }
    catch (error) {
        WriteErrLog(common_model_1.LogLevel.error, WriteOpLog.name, error);
    }
});
exports.WriteOpLog = WriteOpLog;
const WriteOpLogResp = (level, resp) => {
    WriteOpLog(level, resp.locals.eventModule, resp.locals.userId, resp.locals.eventMessage);
};
exports.WriteOpLogResp = WriteOpLogResp;
//# sourceMappingURL=logwriter.js.map