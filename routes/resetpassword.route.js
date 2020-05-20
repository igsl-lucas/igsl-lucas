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
const express_1 = require("express");
const errorhandler_1 = require("../utils/errorhandler");
const user_model_1 = require("../models/user.model");
const pwrequest_model_1 = require("../models/pwrequest.model");
const commonutil_1 = require("../utils/commonutil");
const common_model_1 = require("../common/common.model");
const dotenv_1 = require("dotenv");
const bcryptjs_1 = require("bcryptjs");
const logwriter_1 = require("../utils/logwriter");
dotenv_1.config();
const router = express_1.Router();
exports.ResetPasswordRoute = router;
const moduleName = "API - Forgot Password";
const eventModule = common_model_1.HRISModule.forgotpassword;
router.get('/', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.query.token) === null || _a === void 0 ? void 0 : _a.toString();
        let pwh = yield pwrequest_model_1.PWRequest.findOne({ $and: [{ token: token }, { type: "resetpassword" }, { status: true }] });
        if (pwh) {
            let current_time = Date.now();
            if (current_time > (pwh.create_on + (1000 * 60 * 60 * 24))) {
                resp.status(errorhandler_1.HTTPStatus.OK).json(false);
                return false;
            }
            resp.status(errorhandler_1.HTTPStatus.OK).json(true);
        }
        else {
            resp.status(errorhandler_1.HTTPStatus.OK).json(false);
        }
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.put('/', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.body.token;
        const newPassword = req.body.password;
        commonutil_1.PrepareOpLog(resp, eventModule, "<Reset Password>");
        let pwh = yield pwrequest_model_1.PWRequest.findOne({ $and: [{ token: token }, { type: "resetpassword" }, { status: true }] });
        if (pwh == null) {
            next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, "Token invalid", moduleName));
            return false;
        }
        const user = yield user_model_1.User.findById(pwh.uid);
        if (user) {
            user.password = bcryptjs_1.hashSync(newPassword, 12);
            yield user.save();
            yield pwrequest_model_1.PWRequest.updateOne({ _id: pwh._id }, { status: false });
            commonutil_1.AppendOpLogMessage(resp, "Result: success");
            logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
            resp.status(errorhandler_1.HTTPStatus.OK).json({ "message": "Password Changed" });
        }
        else {
            next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, "Cannot Find User", moduleName));
        }
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error, moduleName));
    }
}));
//# sourceMappingURL=resetpassword.route.js.map