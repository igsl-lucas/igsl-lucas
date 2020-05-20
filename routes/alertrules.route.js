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
const logwriter_1 = require("../utils/logwriter");
const commonutil_1 = require("../utils/commonutil");
const alerthelper_1 = require("../utils/alerthelper");
const router = express_1.Router();
exports.AlertRulesRoute = router;
const moduleName = "API - Alert Rules";
const eventModule = common_model_1.HRISModule.alertrules;
router.get('/', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let target = yield alertrules_model_1.AlertRules.find();
        if (target != null) {
            resp.status(errorhandler_1.HTTPStatus.OK).json(target);
        }
        else {
            next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.NOT_FOUND, 'Record Not Found', moduleName));
        }
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.get('/:id', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let recordId = req.params.id;
        const target = yield alertrules_model_1.AlertRules.findById(recordId);
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
router.post('/', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let alertRules = new alertrules_model_1.AlertRules();
        commonutil_1.PrepareOpLog(resp, eventModule, "<Create New AlertRules>");
        alertRules = req.body;
        commonutil_1.AppendOpLogMessage(resp, "id: " + alertRules._id);
        yield alertrules_model_1.AlertRules.create(alertRules);
        yield alerthelper_1.genAlert();
        commonutil_1.AppendOpLogSuccess(resp);
        logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
        resp.status(errorhandler_1.HTTPStatus.OK).json(alertRules);
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.put('/:id', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let alertRules = new alertrules_model_1.AlertRules();
        commonutil_1.PrepareOpLog(resp, eventModule, "<Update AlertRules>");
        alertRules = req.body;
        commonutil_1.AppendOpLogMessage(resp, "id: " + alertRules._id);
        yield alertrules_model_1.AlertRules.findByIdAndUpdate(req.params.id, alertRules);
        yield alerthelper_1.genAlert();
        commonutil_1.AppendOpLogSuccess(resp);
        logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
        resp.status(errorhandler_1.HTTPStatus.OK).json(alertRules);
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.delete('/:id', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        commonutil_1.PrepareOpLog(resp, eventModule, "<Delete AlertRules>");
        let alertRules = yield alertrules_model_1.AlertRules.findById(req.params.id);
        if (alertRules) {
            commonutil_1.AppendOpLogMessage(resp, "id: " + alertRules._id);
            yield alertrules_model_1.AlertRules.deleteOne({ _id: alertRules._id });
        }
        else {
            commonutil_1.AppendOpLogMessage(resp, "(Target Record Not Found)");
        }
        commonutil_1.AppendOpLogSuccess(resp);
        logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
        resp.status(errorhandler_1.HTTPStatus.NO_CONTENT).json({ message: "OK" });
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
//# sourceMappingURL=alertrules.route.js.map