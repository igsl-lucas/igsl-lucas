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
const mail_model_1 = require("../models/mail.model");
const pwrequest_model_1 = require("../models/pwrequest.model");
const commonutil_1 = require("../utils/commonutil");
const common_model_1 = require("../common/common.model");
const mailhelper_1 = require("../utils/mailhelper");
const dotenv_1 = require("dotenv");
dotenv_1.config();
const router = express_1.Router();
exports.ForgotPasswordRoute = router;
const moduleName = "API - Forgot Password";
const eventModule = common_model_1.HRISModule.forgotpassword;
router.post('/', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let email = req.body.email;
        commonutil_1.PrepareOpLog(resp, eventModule, "<Forgot Password>");
        const user = yield user_model_1.User.findOne({ email: email });
        if (user) {
            const mailTemplate = yield mail_model_1.MessageTemplate.findOne({ type: 'email', for: 'forgotpassword' });
            if (mailTemplate) {
                let pwh = {};
                pwh.uid = user._id;
                pwh.email = email;
                pwh.create_on = Date.now();
                pwh.type = "resetpassword";
                pwh.token = commonutil_1.randomKey(30);
                pwh.status = true;
                yield pwrequest_model_1.PWRequest.create(pwh);
                let newMail = {};
                newMail.from = "noreply@igsl-group.com";
                newMail.to = email;
                newMail.subject = mailTemplate.subject;
                newMail.html = mailTemplate.content;
                newMail.html = newMail.html.replace("{username}", user.name);
                newMail.html = newMail.html.replace("{resetpasswordurl}", req.headers.origin + '/' + common_model_1.HRISModule.resetpassword + '?token=' + pwh.token);
                yield mailhelper_1.sendMail(newMail)
                    .then((res) => resp.status(errorhandler_1.HTTPStatus.OK).json(""))
                    .catch((reason) => next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, reason, moduleName)));
            }
            else {
                next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, 'Cannot Find Mail Template', moduleName));
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
//# sourceMappingURL=forgotpassword.route.js.map