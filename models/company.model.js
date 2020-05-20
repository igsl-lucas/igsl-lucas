"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
exports.phoneNoSchema = {
    area: String,
    no: String
};
exports.bankACSchema = {
    bankno: String,
    branchno: String,
    bankacno: String,
};
exports.taxPaymentSchema = {
    emprname: String,
    emprposition: String,
    emprfileno: String,
};
exports.languageSchema = {
    langcode: String,
    langname: String
};
const companySchema = new mongoose_1.Schema({
    coname: String,
    engname: String,
    brno: String,
    tel: exports.phoneNoSchema,
    fax: exports.phoneNoSchema,
    email: String,
    address: String,
    region: String,
    timezone: String,
    logo: String,
    deflang: exports.languageSchema,
    bankaccount: exports.bankACSchema,
    taxpayment: exports.taxPaymentSchema
});
;
exports.Company = mongoose_1.default.model('companies', companySchema);
//# sourceMappingURL=company.model.js.map