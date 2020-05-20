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
const app_1 = require("./app");
const http_1 = __importDefault(require("http"));
const dotenv_1 = require("dotenv");
const mongoose_1 = __importDefault(require("mongoose"));
const logwriter_1 = require("./utils/logwriter");
dotenv_1.config();
//const logger = LogWriter;
const PORT = process.env.LISTEN_PORT || 8080;
const MONGO_URI = process.env.DATABASE_URL || "";
const server = http_1.default.createServer(app_1.app);
server.listen(PORT);
server.on('listening', () => __awaiter(void 0, void 0, void 0, function* () {
    logwriter_1.WriteSysLog(logwriter_1.LogLevel.info, 'Start-up', `Listening on port ${PORT}`);
    mongoose_1.default.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose_1.default.connection.on('open', () => {
        logwriter_1.WriteSysLog(logwriter_1.LogLevel.info, 'Start-up', 'Connected to Mongo');
    });
    mongoose_1.default.connection.on('error', (err) => {
        logwriter_1.WriteSysLog(logwriter_1.LogLevel.error, 'Start-up', err);
    });
}));
//# sourceMappingURL=main.js.map