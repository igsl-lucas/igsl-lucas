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
const mail_model_1 = require("../models/mail.model");
const logwriter_1 = require("./logwriter");
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = require("dotenv");
const commonutil_1 = require("./commonutil");
const moduleName = 'Helper - MailItem';
dotenv_1.config();
const sendMail = (message) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        let newMail = new mail_model_1.MailQueueItem();
        newMail.from = message.from;
        newMail.to = message.to;
        newMail.cc = message.cc;
        newMail.bcc = message.bcc;
        newMail.subject = message.subject;
        newMail.text = message.text;
        newMail.html = message.html;
        newMail.sendafter = Date.now();
        newMail.retrycount = 0;
        newMail.attachment = message.attachment;
        //newMail = message;
        try {
            yield newMail.save();
            resolve(newMail);
        }
        catch (error) {
            reject(error.message);
        }
    }));
});
exports.sendMail = sendMail;
const newMailRaw = (from, to = "", cc = "", bcc = "", subject = "", text = "", html = "", sendafter = Date.now(), attachment) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        let newMail = new mail_model_1.MailQueueItem();
        newMail.from = from;
        newMail.to = to;
        newMail.cc = cc;
        newMail.bcc = bcc;
        newMail.subject = subject;
        newMail.text = text;
        newMail.html = html;
        newMail.sendafter = sendafter;
        newMail.retrycount = 0;
        newMail.attachment = attachment;
        try {
            yield newMail.save();
            resolve(newMail);
        }
        catch (error) {
            reject(error.message);
        }
    }));
});
exports.NewMailRaw = newMailRaw;
const sendAllMail = (emailHost = '', emailPort = 25, emailSecure = false, emailUser = '', emailPwd = '', emailSendWait = 5000, emailMaxRetry = 0) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allItems = yield mail_model_1.MailQueueItem.find({ sendafter: { $lte: Date.now() }, retrycount: { $lt: emailMaxRetry } });
        let success = 0;
        let failed = 0;
        logwriter_1.WriteSysLog(logwriter_1.LogLevel.verbose, moduleName, `Prepare to send ${allItems.length} message(s).`);
        let transporter = nodemailer_1.default.createTransport({
            host: emailHost,
            port: emailPort,
            secure: emailSecure,
            auth: {
                user: emailUser,
                pass: emailPwd
            }
        });
        for (const item of allItems) {
            try {
                yield sendOneMassage(transporter, item);
                yield archiveOneMail(item);
                success++;
            }
            catch (error) {
                incrementRetryCount(item);
                logwriter_1.WriteErrLog(moduleName, sendAllMail.name, error);
                failed++;
            }
            yield commonutil_1.Delay(emailSendWait);
        }
        if (success > 0) {
            logwriter_1.WriteSysLog(logwriter_1.LogLevel.verbose, moduleName, `${success} message(s) successfully sent.`);
        }
        if (failed > 0) {
            logwriter_1.WriteSysLog(logwriter_1.LogLevel.verbose, moduleName, `${failed} message(s) FAILED to send.`);
        }
    }
    catch (error) {
        logwriter_1.WriteErrLog(moduleName, sendAllMail.name, error);
    }
});
exports.SendAllMail = sendAllMail;
const sendOneMassage = (transporter, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield transporter.sendMail({
            from: message.from,
            to: message.to,
            cc: message.cc,
            bcc: message.bcc,
            subject: message.subject,
            text: message.text,
            html: message.html,
            attachments: message.attachment
        });
        logwriter_1.WriteSysLog(logwriter_1.LogLevel.verbose, moduleName, `Email sent to ${message.to}.`);
    }
    catch (error) {
        throw (error);
    }
});
const incrementRetryCount = (message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        message.retrycount++;
        yield message.save();
    }
    catch (error) {
        logwriter_1.WriteErrLog(moduleName, incrementRetryCount.name, error);
    }
});
const archiveOneMail = (message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sentItem = new mail_model_1.MailItem(message);
        sentItem.sentat = Date.now();
        sentItem.isNew = true;
        yield sentItem.save();
        yield message.remove();
    }
    catch (error) {
        throw (error);
    }
});
//# sourceMappingURL=mailhelper.js.map