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
const staff_model_1 = require("../models/staff.model");
const mail_model_1 = require("../models/mail.model");
const pwrequest_model_1 = require("../models/pwrequest.model");
const mailhelper_1 = require("../utils/mailhelper");
const role_model_1 = require("../models/role.model");
const router = express_1.Router();
exports.UserInvitationRoute = router;
const moduleName = "API - User Invitation";
const eventModule = common_model_1.HRISModule.userprofile;
router.get('/', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.query.token) === null || _a === void 0 ? void 0 : _a.toString();
        let pwh = yield pwrequest_model_1.PWRequest.findOne({ $and: [{ token: token }, { type: "userinvitation" }, { status: true }] });
        if (pwh) {
            let current_time = Date.now();
            if (current_time > (pwh.create_on + (1000 * 60 * 60 * 24))) {
                resp.status(errorhandler_1.HTTPStatus.OK).json(false);
                return false;
            }
            let staff = yield staff_model_1.Staff.findById(pwh.sid);
            if (staff) {
                resp.status(errorhandler_1.HTTPStatus.OK).json({ status: true, staffname: staff.displayname, sid: pwh.sid, email: pwh.email });
            }
            else {
                resp.status(errorhandler_1.HTTPStatus.OK).json(false);
            }
        }
        else {
            resp.status(errorhandler_1.HTTPStatus.OK).json(false);
        }
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.post('/', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        commonutil_1.PrepareOpLog(resp, eventModule, "<send user invitation>");
        let staff = new staff_model_1.Staff();
        staff = req.body;
        const mailTemplate = yield mail_model_1.MessageTemplate.findOne({ type: 'email', for: 'userinvitation' });
        if (mailTemplate) {
            let pwh = {};
            pwh.sid = staff._id;
            pwh.email = staff.igsemailaddress || "";
            pwh.create_on = Date.now();
            pwh.token = commonutil_1.randomKey(30);
            pwh.type = "userinvitation";
            pwh.status = true;
            yield pwrequest_model_1.PWRequest.create(pwh);
            let newMail = {};
            newMail.from = "noreply@igsl-group.com";
            newMail.to = pwh.email;
            newMail.subject = mailTemplate.subject.replace("{systemname}", "HRIS");
            newMail.html = mailTemplate.content;
            newMail.html = newMail.html.replace("{staffname}", staff.displayname || "");
            newMail.html = newMail.html.replace("{systemname}", "HRIS");
            newMail.html = newMail.html.replace("{userinvitationurl}", req.headers.origin + '/' + common_model_1.HRISModule.userinvitation + '?token=' + pwh.token);
            const user = yield user_model_1.User.findById(resp.locals.userId);
            if (user) {
                newMail.html = newMail.html.replace("{username}", user.name);
            }
            yield mailhelper_1.sendMail(newMail).then()
                .catch((reason) => next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, reason, moduleName)));
        }
        else {
            next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, 'Cannot Find Mail Template', moduleName));
        }
        commonutil_1.AppendOpLogSuccess(resp);
        logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
        resp.status(errorhandler_1.HTTPStatus.OK).json("");
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.put('/', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.body.token;
        const password = req.body.password;
        commonutil_1.PrepareOpLog(resp, eventModule, "<User Sign up>");
        let pwh = yield pwrequest_model_1.PWRequest.findOne({ $and: [{ token: token }, { type: "userinvitation" }, { status: true }] });
        if (pwh == null) {
            next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, "Token invalid", moduleName));
            return false;
        }
        let user = {};
        let staff = yield staff_model_1.Staff.findById(pwh.sid);
        let role = yield role_model_1.Role.findOne({ name: "user" });
        if (staff == null || role == null) {
            next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, "Token invalid", moduleName));
            return false;
        }
        user.email = pwh.email;
        user.name = (staff === null || staff === void 0 ? void 0 : staff.displayname) || "";
        user.password = bcryptjs_1.hashSync(password, 12);
        user.portrait = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg==";
        user.refreshtokenversion = 0;
        user.role = role._id;
        user.staff = pwh.sid;
        user.audit = commonutil_1.getCreateAudit(resp);
        let uid = yield user_model_1.User.create(user);
        yield pwrequest_model_1.PWRequest.updateOne({ _id: pwh._id }, { status: false });
        yield staff_model_1.Staff.updateOne({ _id: pwh.sid }, { user: uid });
        resp.status(errorhandler_1.HTTPStatus.OK).json(true);
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error, moduleName));
    }
}));
//# sourceMappingURL=userinvitation.route.js.map