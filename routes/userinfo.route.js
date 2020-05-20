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
const userinfo_model_1 = require("../models/userinfo.model");
const errorhandler_1 = require("../utils/errorhandler");
const common_model_1 = require("../common/common.model");
const router = express_1.Router();
exports.UserInfoRoute = router;
const moduleName = "API - User Lite";
router.get('/', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const format = req.query[common_model_1.UserInfoFormat.Tag];
        let target;
        if (format === common_model_1.UserInfoFormat.NameList) {
            // This format is for a full list of user id vs name, for mapping id to name in list box
            target = yield userinfo_model_1.UserInfo.find().select({ name: 1, email: 1 });
        }
        else {
            // This format is for showing personal information of current user
            let recordId = resp.locals.userId;
            target = yield userinfo_model_1.UserInfo.findOne({ _id: recordId }).populate("role", "name");
        }
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
    var _a;
    try {
        const id = (_a = req.params.id) === null || _a === void 0 ? void 0 : _a.toString();
        let target = yield userinfo_model_1.UserInfo.findOne({ _id: id }).populate("role", "name");
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
//# sourceMappingURL=userinfo.route.js.map