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
const user_model_1 = require("../models/user.model");
const errorhandler_1 = require("../utils/errorhandler");
const router = express_1.Router();
exports.RefreshTokenRoute = router;
const moduleName = "API - RefreshToken";
router.post('/', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    let oldRefreshToken = req.body.refreshtoken;
    let anyError;
    try {
        const payload = user_model_1.VerifyRefreshToken(oldRefreshToken);
        try {
            let user = yield user_model_1.User.findById(payload.userId);
            if (user) {
                if (user.refreshtokenversion == payload.version) //Check whether the refresh token has been forced to expire
                 {
                    try {
                        let accessToken = yield user_model_1.GetAccessToken(user._id, user.role);
                        let refreshToken = yield user_model_1.GetRefreshToken(user._id);
                        const ret = {
                            userId: user._id,
                            userName: user.name,
                            accesstoken: accessToken,
                            refreshtoken: refreshToken
                        };
                        resp.status(errorhandler_1.HTTPStatus.OK).json(ret);
                    }
                    catch (error) {
                        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
                    }
                }
                else {
                    next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.NOT_ACCEPTABLE, "Invalid token version", moduleName));
                }
            }
            else {
                next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.NOT_ACCEPTABLE, "No corresponding user", moduleName));
            }
        }
        catch (error) {
            next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
        }
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.NOT_ACCEPTABLE, error.message, moduleName));
    }
}));
//# sourceMappingURL=refreshtoken.route.js.map