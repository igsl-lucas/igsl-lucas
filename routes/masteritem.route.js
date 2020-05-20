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
const masteritem_model_1 = require("../models/masteritem.model");
const errorhandler_1 = require("../utils/errorhandler");
const common_model_1 = require("../common/common.model");
const logwriter_1 = require("../utils/logwriter");
const commonutil_1 = require("../utils/commonutil");
const router = express_1.Router();
exports.MasterItemRoute = router;
const moduleName = "API - MasterItem";
const eventModule = common_model_1.HRISModule.masteritem;
router.get('/', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const type = req.query.type;
        const showall = ((_a = req.query.showall) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase()) == "true";
        let target;
        if (type != "undefined") {
            if (showall) {
                target = yield masteritem_model_1.MasterItem.find().and([{ "type": type }]);
            }
            else {
                target = yield masteritem_model_1.MasterItem.find().and([{ "type": type, status: true }]);
            }
        }
        else {
            target = yield masteritem_model_1.MasterItem.find().and([{ "visible": true, status: true }]);
        }
        resp.status(errorhandler_1.HTTPStatus.OK).json(target);
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.get('/chkExist', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = req.query.type;
        const code = req.query.code;
        const result = yield masteritem_model_1.MasterItem.find().and([{ "code": code, "type": type }]);
        let target = result.length;
        resp.status(errorhandler_1.HTTPStatus.OK).json(target);
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.get('/:id', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let recordId = req.params.id;
        const target = yield masteritem_model_1.MasterItem.findById(recordId).populate("audit.createBy", "name").populate("audit.updateBy", "name");
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
        let masteritem = new masteritem_model_1.MasterItem();
        commonutil_1.PrepareOpLog(resp, eventModule, "<Create New MasterItem>");
        masteritem = req.body;
        //masteritem.status = true;
        masteritem.visible = true;
        masteritem.audit = commonutil_1.getCreateAudit(resp);
        commonutil_1.AppendOpLogMessage(resp, "code: " + masteritem.code);
        yield masteritem_model_1.MasterItem.create(masteritem);
        commonutil_1.AppendOpLogSuccess(resp);
        logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
        resp.status(errorhandler_1.HTTPStatus.OK).json(masteritem);
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.put('/:id', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let masteritem = new masteritem_model_1.MasterItem();
        commonutil_1.PrepareOpLog(resp, eventModule, "<Update MasterItem>");
        masteritem = req.body;
        masteritem.audit = commonutil_1.getUpdateAudit(resp, masteritem.audit);
        commonutil_1.AppendOpLogMessage(resp, "code: " + masteritem.code);
        yield masteritem_model_1.MasterItem.findByIdAndUpdate(req.params.id, masteritem);
        commonutil_1.AppendOpLogSuccess(resp);
        logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
        resp.status(errorhandler_1.HTTPStatus.OK).json(masteritem);
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.delete('/:id', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        commonutil_1.PrepareOpLog(resp, eventModule, "<Delete MasterItem>");
        let masteritem = yield masteritem_model_1.MasterItem.findById(req.params.id);
        if (masteritem) {
            commonutil_1.AppendOpLogMessage(resp, "code: " + masteritem.code);
            yield masteritem_model_1.MasterItem.deleteOne({ _id: masteritem._id });
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
//# sourceMappingURL=masteritem.route.js.map