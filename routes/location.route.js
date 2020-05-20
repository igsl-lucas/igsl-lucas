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
const location_model_1 = require("../models/location.model");
const errorhandler_1 = require("../utils/errorhandler");
const common_model_1 = require("../common/common.model");
const logwriter_1 = require("../utils/logwriter");
const commonutil_1 = require("../utils/commonutil");
const router = express_1.Router();
exports.LocationRoute = router;
const moduleName = "API - Location";
const eventModule = common_model_1.HRISModule.location;
router.get('/', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const code = req.query[common_model_1.QueryTag.TagCode];
        const getCount = (req.query[common_model_1.QueryTag.TagCount] === common_model_1.QueryTag.ValueYes);
        let target;
        let result;
        if (code) {
            result = yield location_model_1.Location.find({ code: new RegExp(`^${code}$`, 'i') });
        }
        else {
            result = yield location_model_1.Location.find();
        }
        if (getCount) {
            target = result.length;
        }
        else {
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
        const target = yield location_model_1.Location.findById(recordId).populate("audit.createBy", "name").populate("audit.updateBy", "name");
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
        let location = new location_model_1.Location();
        commonutil_1.PrepareOpLog(resp, eventModule, "<Create New Location>");
        location = req.body;
        location.audit = commonutil_1.getCreateAudit(resp);
        commonutil_1.AppendOpLogMessage(resp, "code: " + location.code);
        yield location_model_1.Location.create(location);
        commonutil_1.AppendOpLogSuccess(resp);
        logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
        resp.status(errorhandler_1.HTTPStatus.OK).json(location);
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.put('/:id', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let location = new location_model_1.Location();
        commonutil_1.PrepareOpLog(resp, eventModule, "<Update Location>");
        location = req.body;
        location.audit = commonutil_1.getUpdateAudit(resp, location.audit);
        commonutil_1.AppendOpLogMessage(resp, "code: " + location.code);
        yield location_model_1.Location.findByIdAndUpdate(req.params.id, location);
        commonutil_1.AppendOpLogSuccess(resp);
        logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
        resp.status(errorhandler_1.HTTPStatus.OK).json(location);
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.delete('/:id', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        commonutil_1.PrepareOpLog(resp, eventModule, "<Delete Location>");
        let location = yield location_model_1.Location.findById(req.params.id);
        if (location) {
            commonutil_1.AppendOpLogMessage(resp, "code: " + location.code);
            yield location_model_1.Location.deleteOne({ _id: location._id });
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
//# sourceMappingURL=location.route.js.map