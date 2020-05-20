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
const alertrules_model_1 = require("../models/alertrules.model");
const errorhandler_1 = require("../utils/errorhandler");
const common_model_1 = require("../common/common.model");
const commonutil_1 = require("../utils/commonutil");
const logwriter_1 = require("../utils/logwriter");
const staff_model_1 = require("../models/staff.model");
const router = express_1.Router();
exports.AlertItemsRoute = router;
const moduleName = "API - Alert Items";
const eventModule = common_model_1.HRISModule.alertrules;
router.get('/', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userAlertItemQuery = { $and: [{ 'alertTo.alerttoid': resp.locals.userId }, { 'alertTo.alerttype': 'user' }, { alertmth: { "$regex": "s", "$options": "i" } }, { status: { $nin: ["completed", "ignored", "deleted"] } }] };
        let userAlertItems = [];
        let deptAlertItems = [];
        userAlertItems = yield alertrules_model_1.AlertItems.find(userAlertItemQuery).populate("comment.uid", "name").populate("applyTo", "staffnumber");
        yield staff_model_1.Staff.findOne({ user: resp.locals.userId }).then(function (data) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                if ((_a = data === null || data === void 0 ? void 0 : data.lastEmployment) === null || _a === void 0 ? void 0 : _a.department) {
                    let deptAlertItemQuery = { $and: [{ 'alertTo.alerttoid': (_b = data === null || data === void 0 ? void 0 : data.lastEmployment) === null || _b === void 0 ? void 0 : _b.department }, { 'alertTo.alerttype': 'dept' }, { status: { $nin: ["completed", "ignored", "deleted"] } }] };
                    deptAlertItems = yield alertrules_model_1.AlertItems.find(deptAlertItemQuery).populate("comment.uid", "name").populate("applyTo", "staffnumber");
                }
            });
        });
        resp.status(errorhandler_1.HTTPStatus.OK).json(userAlertItems.concat(deptAlertItems));
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.put('/:id', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        commonutil_1.PrepareOpLog(resp, eventModule, "<Update AlertItems>");
        switch (req.body.type) {
            case "updateStatus":
                updateStatus(req.body.data, req, resp);
                break;
            case "addComment":
                addComment(req.body.data, req, resp);
                break;
            case "getComment":
                getComment(req.body.data, req, resp, next);
                break;
        }
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.delete('/:id', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        commonutil_1.PrepareOpLog(resp, eventModule, "<Delete AlertItems>");
        yield alertrules_model_1.AlertItems.findByIdAndUpdate(req.params.id, { status: "deleted" });
        commonutil_1.AppendOpLogSuccess(resp);
        logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
        resp.status(errorhandler_1.HTTPStatus.NO_CONTENT).json({ message: "OK" });
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
function updateStatus(alertItems, req, resp) {
    return __awaiter(this, void 0, void 0, function* () {
        commonutil_1.AppendOpLogMessage(resp, "id: " + alertItems._id);
        yield alertrules_model_1.AlertItems.findByIdAndUpdate(alertItems._id, alertItems);
        commonutil_1.AppendOpLogSuccess(resp);
        logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
        resp.status(errorhandler_1.HTTPStatus.OK).json("");
    });
}
function addComment(content, req, resp) {
    return __awaiter(this, void 0, void 0, function* () {
        commonutil_1.AppendOpLogMessage(resp, "id: " + req.params.id);
        let currComment = {};
        currComment.uid = resp.locals.userId;
        currComment.date = Date.now();
        currComment.content = content;
        yield alertrules_model_1.AlertItems.findByIdAndUpdate(req.params.id, { $push: { comment: currComment } });
        commonutil_1.AppendOpLogSuccess(resp);
        logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
        resp.status(errorhandler_1.HTTPStatus.OK).json("");
    });
}
function getComment(content, req, resp, next) {
    return __awaiter(this, void 0, void 0, function* () {
        commonutil_1.AppendOpLogMessage(resp, "id: " + req.params.id);
        let alertItem = yield alertrules_model_1.AlertItems.findById(req.params.id).populate("comment.uid", "name");
        if (alertItem) {
            commonutil_1.AppendOpLogSuccess(resp);
            logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
            resp.status(errorhandler_1.HTTPStatus.OK).json(alertItem.comment);
        }
        else {
            next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.NOT_FOUND, undefined, moduleName));
        }
    });
}
//# sourceMappingURL=alertitems.route.js.map