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
const mailhelper_1 = require("./utils/mailhelper");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
const logwriter_1 = require("./utils/logwriter");
const commonutil_1 = require("./utils/commonutil");
const moduleName = 'Util - Send Email';
dotenv_1.config();
const MONGO_URI = process.env.DATABASE_URL || "";
const dbRetryWait = Number(process.env.DATABASE_RETRY_WAIT) || 30000;
const emailHost = process.env.EMAIL_HOST || '';
const emailPort = Number(process.env.EMAIL_PORT) || 25;
const emailSecure = process.env.EMAIL_SECURE === 'true' || false;
const emailUser = process.env.EMAIL_USER || '';
const emailPwd = process.env.EMAIL_PWD || '';
const emailSendWait = Number(process.env.EMAIL_SEND_WAIT) || 5000;
const emailCheckWait = Number(process.env.EMAIL_CHECK_WAIT) || 30000;
const emailMaxRetry = Number(process.env.EMAIL_MAX_RETRY) || 0;
mongoose_1.default.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch((reason) => { });
mongoose_1.default.connection.on('open', () => __awaiter(void 0, void 0, void 0, function* () {
    yield logwriter_1.WriteSysLog(logwriter_1.LogLevel.info, moduleName, `Job started and will check message queue for every ${emailCheckWait} ms`);
    while (true) {
        yield mailhelper_1.SendAllMail(emailHost, emailPort, emailSecure, emailUser, emailPwd, emailSendWait, emailMaxRetry);
        logwriter_1.WriteSysLog(logwriter_1.LogLevel.verbose, moduleName, `Waiting for ${emailCheckWait}ms to check message queue`);
        yield commonutil_1.Delay(emailCheckWait);
    }
}));
mongoose_1.default.connection.on('error', (err) => __awaiter(void 0, void 0, void 0, function* () {
    //console.error(err.message);
    yield logwriter_1.WriteErrLog(moduleName, "Connect MongoDB", err);
    logwriter_1.WriteSysLog(logwriter_1.LogLevel.verbose, moduleName, `Wait for ${dbRetryWait}ms to retry`);
    yield commonutil_1.Delay(dbRetryWait);
    logwriter_1.WriteSysLog(logwriter_1.LogLevel.verbose, moduleName, "Retry Connect MongoDB");
    mongoose_1.default.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch((reason) => { });
    ;
}));
process.on('exit', () => { logwriter_1.WriteSysLog(logwriter_1.LogLevel.info, moduleName, "Job terminated."); });
process.on('SIGINT', () => { process.exit(1); });
process.on('SIGTERM', () => { process.exit(1); });
process.on('uncaughtException', () => { process.exit(1); });
//# sourceMappingURL=sendmail.js.map