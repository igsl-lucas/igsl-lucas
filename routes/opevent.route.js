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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const opevent_model_1 = require("../models/opevent.model");
const errorhandler_1 = require("../utils/errorhandler");
const common_model_1 = require("../common/common.model");
const commonutil_1 = require("../utils/commonutil");
const moment_1 = __importDefault(require("moment"));
const router = express_1.Router();
exports.OpEventRoute = router;
const moduleName = "API - OpEvent";
const eventModule = common_model_1.HRISModule.eventviewer;
router.get('/', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let start = new Date((_a = req.query.start) === null || _a === void 0 ? void 0 : _a.toString());
        let end = new Date((_b = req.query.end) === null || _b === void 0 ? void 0 : _b.toString());
        // if no valid start input, return today
        if (start.toString() == "Invalid Date") {
            start = new Date(moment_1.default().startOf('d').format());
        }
        // if no valid end input, return 1 day after
        if (end.toString() == "Invalid Date") {
            end = new Date(moment_1.default().endOf('d').format());
        }
        commonutil_1.PrepareOpLog(resp, eventModule, "<Open Event Viewer>");
        commonutil_1.AppendOpLogMessage(resp, "start: " + start);
        commonutil_1.AppendOpLogMessage(resp, "end: " + end);
        let target = yield opevent_model_1.OpEvent.find({ recorddt: { $gte: start, $lte: end } }).select("-message");
        commonutil_1.AppendOpLogSuccess(resp);
        // WriteOpLogResp(LogLevel.info, resp);
        resp.status(errorhandler_1.HTTPStatus.OK).json(target);
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.get('/:id', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let recordId = req.params.id;
        const target = yield opevent_model_1.OpEvent.findById(recordId).populate("user", "name");
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
//# sourceMappingURL=opevent.route.js.map