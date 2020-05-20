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
const bcryptjs_1 = require("bcryptjs");
const user_model_1 = require("../models/user.model");
const common_model_1 = require("../common/common.model");
const logwriter_1 = require("../utils/logwriter");
const commonutil_1 = require("../utils/commonutil");
const router = express_1.Router();
exports.LoginRoute = router;
const moduleName = "API - login";
const eventModule = common_model_1.HRISModule.login;
const loginByPassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.User.findOne({ email: email });
            if (user) {
                if (bcryptjs_1.compareSync(password, user.password)) {
                    resolve(user);
                }
                else {
                    reject("Invalid Password");
                }
            }
            else {
                reject("Invalid User");
            }
        }
        catch (error) {
            reject(error.message);
        }
    }));
});
const loginByRefreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = user_model_1.VerifyRefreshToken(token);
            if (payload) {
                const user = yield user_model_1.User.findById(payload.userId);
                if (user) {
                    if (user.refreshtokenversion === payload.version) {
                        resolve(user);
                    }
                    else {
                        reject("token expired by admin");
                    }
                }
                else {
                    reject("Invalid User ID");
                }
            }
            else {
                reject("Invalid Refresh Token");
            }
        }
        catch (error) {
            reject(error.message);
        }
    }));
});
router.post('/', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let email = req.body.email;
        let password = req.body.password;
        let inToken = req.body.refreshtoken;
        let user;
        commonutil_1.PrepareOpLog(resp, eventModule, "<Login");
        if (inToken) {
            commonutil_1.AppendOpLogMessage(resp, "by token>");
            user = yield loginByRefreshToken(inToken);
        }
        else {
            commonutil_1.AppendOpLogMessage(resp, "by password>");
            commonutil_1.AppendOpLogMessage(resp, "Login:");
            commonutil_1.AppendOpLogMessage(resp, email);
            user = yield loginByPassword(email, password);
        }
        if (user) {
            if (user.status !== false) {
                let accessToken = yield user_model_1.GetAccessToken(user._id, user.role);
                let refreshToken = yield user_model_1.GetRefreshToken(user._id);
                const ret = {
                    userId: user._id,
                    userName: user.name,
                    accesstoken: accessToken,
                    refreshtoken: refreshToken
                };
                resp.locals.userId = user._id;
                commonutil_1.AppendOpLogMessage(resp, "Result: success");
                logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
                resp.status(errorhandler_1.HTTPStatus.OK).json(ret);
            }
            else {
                next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.NOT_ACCEPTABLE, "User Account Disabled", moduleName));
            }
        }
        else {
            next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.NOT_ACCEPTABLE, "Invalid Credential", moduleName));
        }
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.NOT_ACCEPTABLE, error, moduleName));
    }
}));
//# sourceMappingURL=login.route.js.map