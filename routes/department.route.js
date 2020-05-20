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
const department_model_1 = require("../models/department.model");
const errorhandler_1 = require("../utils/errorhandler");
const common_model_1 = require("../common/common.model");
const logwriter_1 = require("../utils/logwriter");
const commonutil_1 = require("../utils/commonutil");
const router = express_1.Router();
exports.DepartmentRoute = router;
const moduleName = "API - Department";
const eventModule = common_model_1.HRISModule.department;
router.get('/', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const code = (_a = req.query.code) === null || _a === void 0 ? void 0 : _a.toString();
        const getCount = (req.query.count === "1");
        let target;
        console.info("code:" + code);
        console.info("count:" + getCount);
        if (code && getCount) {
            const result = yield department_model_1.Department.find({ code: `${code}` });
            target = result.length;
        }
        else {
            target = yield department_model_1.Department.find();
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
        const target = yield department_model_1.Department.findById(recordId).populate("audit.createBy", "name").populate("audit.updateBy", "name");
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
        let item = new department_model_1.Department();
        commonutil_1.PrepareOpLog(resp, eventModule, "<Create New Department>");
        item = req.body;
        item.audit = commonutil_1.getCreateAudit(resp);
        commonutil_1.AppendOpLogMessage(resp, "code: " + req.body.code);
        yield department_model_1.Department.create(item);
        commonutil_1.AppendOpLogSuccess(resp);
        logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
        resp.status(errorhandler_1.HTTPStatus.OK).json(department_model_1.Department);
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.put('/:id', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let item = new department_model_1.Department();
        commonutil_1.PrepareOpLog(resp, eventModule, "<Update Department>");
        item = req.body;
        item.audit = commonutil_1.getUpdateAudit(resp, item.audit);
        commonutil_1.AppendOpLogMessage(resp, "code: " + req.body.code);
        yield department_model_1.Department.findByIdAndUpdate(req.params.id, item);
        commonutil_1.AppendOpLogSuccess(resp);
        logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
        resp.status(errorhandler_1.HTTPStatus.OK).json(department_model_1.Department);
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.delete('/:id', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        commonutil_1.PrepareOpLog(resp, eventModule, "<Delete Department>");
        let department = yield department_model_1.Department.findById(req.params.id);
        if (department) {
            commonutil_1.AppendOpLogMessage(resp, "code: " + department.code);
            yield department_model_1.Department.deleteOne({ _id: department._id });
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
//# sourceMappingURL=department.route.js.map