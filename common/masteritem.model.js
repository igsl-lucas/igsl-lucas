"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_model_1 = require("./common.model");
var MasterType;
(function (MasterType) {
    MasterType["bank"] = "bank";
    MasterType["tel_area"] = "areacode";
    MasterType["timezone"] = "timezone";
    MasterType["position"] = "position";
    MasterType["gender"] = "gender";
    MasterType["maritalstatus"] = "maritalstatus";
    MasterType["employmenttype"] = "employmenttype";
    MasterType["currency"] = "currency";
    MasterType["salarytype"] = "salarytype";
})(MasterType = exports.MasterType || (exports.MasterType = {}));
exports.LanguageItems = [
    { value: common_model_1.Language.en, desc: 'English' },
    { value: common_model_1.Language.tch, desc: '繁體中文' },
    { value: common_model_1.Language.sch, desc: '简体中文' },
];
exports.MasterTypeItems = [
    { type: MasterType.bank, visible: true, en: 'Bank', tch: '銀行', sch: '银行' },
    { type: MasterType.timezone, visible: false, en: 'Time Zone', tch: '時區', sch: '时区' },
    { type: MasterType.tel_area, visible: false, en: 'Tel. Area', tch: '區號', sch: '区号' },
    { type: MasterType.position, visible: true, en: 'Position', tch: '職位', sch: '职位' },
    { type: MasterType.gender, visible: true, en: 'Gender', tch: '性別', sch: '性别' },
    { type: MasterType.maritalstatus, visible: true, en: 'Marrital Status', tch: '婚姻狀況', sch: '婚姻状况' },
    { type: MasterType.employmenttype, visible: true, en: 'Employment Type', tch: '僱傭類型', sch: '雇佣类型' },
    { type: MasterType.currency, visible: true, en: 'Currency', tch: '貨幣', sch: '货币' },
    { type: MasterType.salarytype, visible: true, en: 'Salary Type', tch: '薪資類型', sch: '薪资类型' },
];
//# sourceMappingURL=masteritem.model.js.map