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
const uploadfile_model_1 = require("../models/uploadfile.model");
const commonutil_1 = require("../utils/commonutil");
const common_model_1 = require("../common/common.model");
const logwriter_1 = require("../utils/logwriter");
const router = express_1.Router();
exports.UserRoute = router;
const moduleName = "API - User";
const eventModule = common_model_1.HRISModule.user;
router.post('/', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = resp.locals.userId;
        const body = req.body;
        const type = body.type;
        const attachId = body.fileId;
        if (type === common_model_1.UserPostType.TypePortrait) {
            commonutil_1.PrepareOpLog(resp, common_model_1.HRISModule.userprofile, "<Change User Portrait>");
            const imageFile = yield uploadfile_model_1.Uploadfile.findById(attachId);
            const user = yield user_model_1.User.findById(userId);
            if (imageFile && user) {
                commonutil_1.AppendOpLogMessage(resp, "user: " + user.email);
                user.portrait = "data:image/png;base64," + imageFile.content.toString('base64');
                yield user.save();
                commonutil_1.AppendOpLogSuccess(resp);
                logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
                resp.status(errorhandler_1.HTTPStatus.OK).json({ message: "OK" });
            }
            else {
                next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.NOT_FOUND, 'Invalid User ID or Photo', moduleName));
            }
        }
        else {
            next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.BAD_REQUEST, 'Invalid Request: ' + type, moduleName));
        }
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.post('/:id', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const body = req.body;
        const type = body.type;
        if (type === common_model_1.UserPostType.TypeForceOut) {
            commonutil_1.PrepareOpLog(resp, common_model_1.HRISModule.user, "<Force Logout>");
            const user = yield user_model_1.User.findById(userId);
            if (user) {
                commonutil_1.AppendOpLogMessage(resp, "user: " + user.email);
                user.refreshtokenversion += 1;
                yield user.save();
                commonutil_1.AppendOpLogSuccess(resp);
                logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
                resp.status(errorhandler_1.HTTPStatus.OK).json(true);
            }
            else {
                next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.NOT_FOUND, 'Invalid User ID', moduleName));
            }
        }
        else {
            next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.BAD_REQUEST, 'Invalid Request: ' + type, moduleName));
        }
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.put('/:id', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let item = new user_model_1.User();
        commonutil_1.PrepareOpLog(resp, eventModule, "<Update User>");
        item = req.body;
        item.audit = commonutil_1.getUpdateAudit(resp, item.audit);
        commonutil_1.AppendOpLogMessage(resp, "email: " + item.email);
        yield user_model_1.User.findByIdAndUpdate(req.params.id, item);
        commonutil_1.AppendOpLogSuccess(resp);
        logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
        resp.status(errorhandler_1.HTTPStatus.OK).json(item);
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.get('/', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query[common_model_1.QueryTag.TagID];
        const email = req.query[common_model_1.QueryTag.TagEmail];
        const getCount = (req.query[common_model_1.QueryTag.TagCount] === common_model_1.QueryTag.ValueYes);
        const getCanUse = (req.query[common_model_1.QueryTag.TagCanUse] === common_model_1.QueryTag.ValueYes);
        let target;
        let result;
        if (email) {
            result = yield user_model_1.User.find({ $and: [{ email: new RegExp(`^${email}$`, 'i') }, { _id: { $ne: id } }] }).select("-password -portrait");
        }
        else {
            result = yield user_model_1.User.find().select("-password -portrait");
        }
        if (getCount) {
            target = result.length;
        }
        else if (getCanUse) {
            target = (result.length === 0);
        }
        else {
            result.forEach((item) => {
                if (item.status === undefined) {
                    item.status = true;
                }
            });
            target = result;
        }
        resp.status(errorhandler_1.HTTPStatus.OK).json(target);
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.get('/:id', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let recordId = req.params.id;
        const target = yield user_model_1.User.findById(recordId).populate("audit.createBy", "name").populate("audit.updateBy", "name");
        if (target) {
            resp.status(errorhandler_1.HTTPStatus.OK).json(target);
        }
        else {
            next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.NOT_FOUND, undefined, moduleName));
        }
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
//# sourceMappingURL=user.route.js.map