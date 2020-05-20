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
const commonutil_1 = require("../utils/commonutil");
const common_model_1 = require("../common/common.model");
const logwriter_1 = require("../utils/logwriter");
const router = express_1.Router();
exports.ChangePasswordRoute = router;
const moduleName = "API - Change Password";
const eventModule = common_model_1.HRISModule.userprofile;
router.post('/', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;
        commonutil_1.PrepareOpLog(resp, eventModule, "<Change Password>");
        // console.info("UserID: " + resp.locals.userId);
        const user = yield user_model_1.User.findById(resp.locals.userId);
        if (user) {
            if (bcryptjs_1.compareSync(oldPassword, user.password)) {
                user.password = bcryptjs_1.hashSync(newPassword, 12);
                yield user.save();
                commonutil_1.AppendOpLogMessage(resp, "Result: success");
                logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
                resp.status(errorhandler_1.HTTPStatus.OK).json({ "message": "Password Changed" });
            }
            else {
                next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.NOT_ACCEPTABLE, "Wrong Old Password", moduleName));
            }
        }
        else {
            next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, "Cannot Find User", moduleName));
        }
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error, moduleName));
    }
}));
//# sourceMappingURL=changepassword.route.js.map