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
Object.defineProperty(exports, "__esModule", { value: true });
const common_model_1 = require("../common/common.model");
exports.Delay = (ms) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(resolve => setTimeout(resolve, ms));
});
exports.PrepareOpLog = (resp, source, message) => {
    resp.locals.eventModule = source;
    resp.locals.eventMessage = message;
};
exports.AppendOpLogSuccess = (resp) => {
    resp.locals.eventMessage += " ";
    resp.locals.eventMessage += common_model_1.EventResult.success;
};
exports.AppendOpLogMessage = (resp, message) => {
    resp.locals.eventMessage += " ";
    resp.locals.eventMessage += message;
};
exports.getCreateAudit = (resp) => {
    const recordTime = new Date();
    const retValue = {
        createBy: resp.locals.userId,
        createOn: recordTime,
        updateBy: resp.locals.userId,
        updateOn: recordTime,
    };
    return retValue;
};
exports.getUpdateAudit = (resp, oldAudit = undefined) => {
    const recordTime = new Date();
    if (oldAudit) {
        const retValue = oldAudit;
        retValue.updateBy = resp.locals.userId;
        retValue.updateOn = recordTime;
        return retValue;
    }
    else {
        return exports.getCreateAudit(resp);
    }
};
exports.randomKey = function (string_length = 10) {
    var str_now = new Date().getTime().toString(16);
    var str_random = "";
    var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < string_length - str_now.length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        str_random += chars.substring(rnum, rnum + 1);
    }
    return (str_now + str_random).toLowerCase();
};
//# sourceMappingURL=commonutil.js.map