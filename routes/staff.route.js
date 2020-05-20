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
const common_model_1 = require("../common/common.model");
const logwriter_1 = require("../utils/logwriter");
const commonutil_1 = require("../utils/commonutil");
const staff_model_1 = require("../models/staff.model");
const router = express_1.Router();
exports.StaffRoute = router;
const moduleName = "API - Staff";
const eventModule = common_model_1.HRISModule.staff;
router.get('/', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const staffnumber = (_a = req.query.staffnumber) === null || _a === void 0 ? void 0 : _a.toString();
        const getCount = (req.query.count === "1");
        let target;
        if (staffnumber && getCount) {
            const result = yield staff_model_1.Staff.find({ "staffnumber": staffnumber });
            target = result.length;
        }
        else {
            target = yield staff_model_1.Staff.find();
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
        let staffPhotoImg = req.query.staffPhotoImg;
        var target = null;
        target = yield staff_model_1.Staff.findById(recordId).populate("notes.createdbyuser", ["name"])
            .populate("attachments", ["-content"]);
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
        let staff = new staff_model_1.Staff();
        commonutil_1.PrepareOpLog(resp, eventModule, "<Create New Staff>");
        staff = req.body;
        yield staff_model_1.Staff.create(staff);
        commonutil_1.AppendOpLogSuccess(resp);
        logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
        resp.status(errorhandler_1.HTTPStatus.OK).json(staff);
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.put('/:id', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let staff = new staff_model_1.Staff();
        commonutil_1.PrepareOpLog(resp, eventModule, "<Update Staff>");
        staff = req.body;
        commonutil_1.AppendOpLogMessage(resp, "staff number: " + staff.staffnumber);
        console.log(req.body);
        yield staff_model_1.Staff.findByIdAndUpdate(req.params.id, staff);
        commonutil_1.AppendOpLogSuccess(resp);
        logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
        resp.status(errorhandler_1.HTTPStatus.OK).json(staff);
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.delete('/:id', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        commonutil_1.PrepareOpLog(resp, eventModule, "<Delete Staff>");
        let staff = yield staff_model_1.Staff.findById(req.params.id);
        if (staff) {
            commonutil_1.AppendOpLogMessage(resp, "staff number: " + staff.staffnumber);
            yield staff_model_1.Staff.deleteOne({ _id: staff._id });
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
//# sourceMappingURL=staff.route.js.map