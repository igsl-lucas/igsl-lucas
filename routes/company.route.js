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
const company_model_1 = require("../models/company.model");
const logwriter_1 = require("../utils/logwriter");
const errorhandler_1 = require("../utils/errorhandler");
const uploadfile_model_1 = require("../models/uploadfile.model");
const router = express_1.Router();
exports.CompanyRoute = router;
const moduleName = 'Company';
router.get('/changeLogo', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileID = req.query.id;
        const tempFile = yield uploadfile_model_1.Uploadfile.findById(fileID);
        if (tempFile != null) {
            resp.status(errorhandler_1.HTTPStatus.OK).json("data:" + tempFile.mimetype + ";base64," + tempFile.content.toString('base64'));
        }
        else {
            next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.NOT_FOUND, 'Record Not Found', moduleName));
        }
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.get('/getCompanyInfo', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = yield company_model_1.Company.findOne();
        if (company != null) {
            resp.status(errorhandler_1.HTTPStatus.OK).json(company);
        }
        else {
            next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.NOT_FOUND, 'Record Not Found', moduleName));
        }
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.put('/updateCompanyInfo', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        yield company_model_1.Company.findOneAndUpdate({ _id: data._id }, data);
        resp.status(errorhandler_1.HTTPStatus.OK).json();
    }
    catch (error) {
        resp.status(500).json({ message: error.message });
        logwriter_1.WriteSysLog(logwriter_1.LogLevel.error, moduleName, error.message);
    }
}));
//# sourceMappingURL=company.route.js.map