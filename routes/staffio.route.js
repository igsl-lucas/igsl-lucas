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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const excel = __importStar(require("exceljs"));
const dateformat_1 = __importDefault(require("dateformat"));
const errorhandler_1 = require("../utils/errorhandler");
const common_model_1 = require("../common/common.model");
const logwriter_1 = require("../utils/logwriter");
const commonutil_1 = require("../utils/commonutil");
const staff_model_1 = require("../models/staff.model");
const uploadfile_model_1 = require("../models/uploadfile.model");
const masteritem_model_1 = require("../models/masteritem.model");
const masteritem_model_2 = require("../common/masteritem.model");
const router = express_1.Router();
exports.StaffIORoute = router;
const moduleName = "API - Staff IO";
const eventModule = common_model_1.HRISModule.staff;
let existStaff;
let importStaff = [];
let banks;
const exportDateOnlyFormat = "yyyy-mm-dd";
const sheetName = "Sheet1";
//warning message
const warningNonEmpty = "Empty value is not allowed";
const warningUnique = "Must be unique";
const warningInvalid = "Invalid value";
router.post('/', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = req.body.type;
        if (type === common_model_1.StaffPostType.TypeExportList) {
            commonutil_1.PrepareOpLog(resp, eventModule, "<Export Staff List>");
            let fileId = yield generateStaffListFile();
            let target = yield uploadfile_model_1.Uploadfile.findById(fileId).select("-content");
            commonutil_1.AppendOpLogSuccess(resp);
            logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
            resp.status(errorhandler_1.HTTPStatus.OK).json(target);
        }
        else if (type === common_model_1.StaffPostType.TypeImportList) {
            let fileId = req.body.fileId;
            existStaff = yield staff_model_1.Staff.find();
            importStaff = [];
            banks = yield masteritem_model_1.MasterItem.find({ type: masteritem_model_2.MasterType.bank });
            commonutil_1.PrepareOpLog(resp, eventModule, "<Import Staff List>");
            let resultFileId = yield processStaffListFile(fileId);
            let target = yield uploadfile_model_1.Uploadfile.findById(resultFileId).select("-content");
            if (fileId == resultFileId) {
                commonutil_1.AppendOpLogSuccess(resp);
                logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
            }
            else {
                commonutil_1.AppendOpLogMessage(resp, "invalid file content and need to fix");
                logwriter_1.WriteOpLogResp(common_model_1.LogLevel.info, resp);
            }
            resp.status(errorhandler_1.HTTPStatus.OK).json(target);
        }
        else {
            next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.BAD_REQUEST, 'Invalid Request: ' + type, moduleName));
        }
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
const processStaffListFile = (fileId) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        let result;
        try {
            let file = yield uploadfile_model_1.Uploadfile.findById(fileId);
            if (!file) {
                throw (new Error("Import file not found"));
            }
            let sheet = yield loadandCheckFormat(file, common_model_1.FileTemplate.Staff);
            result = checkImportSheet(sheet);
            if (!result) {
                let commentFile = new uploadfile_model_1.Uploadfile();
                commentFile.originalname = "(reply)" + file.originalname;
                commentFile.encoding = file.encoding;
                commentFile.mimetype = file.mimetype;
                commentFile.lastmodified = new Date();
                commentFile.isvalid = true;
                commentFile.content = yield sheet.workbook.xlsx.writeBuffer();
                yield commentFile.save();
                resolve(commentFile._id);
            }
            else {
                importStaff.forEach((s) => __awaiter(void 0, void 0, void 0, function* () {
                    yield s.save();
                }));
                resolve(fileId);
            }
        }
        catch (error) {
            reject(error);
        }
    }));
});
const checkImportSheet = (sheet) => {
    let retValue = true;
    sheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
            if (!checkImportRow(row)) {
                retValue = false;
            }
        }
    });
    return retValue;
};
const checkImportRow = (row) => {
    let retValue = true;
    // let staff = new Staff();
    let cells = [];
    let staffId = "";
    let staff;
    staffId = getCellContent(row, 31); //.replace(/"/g,'',);
    if (staffId) {
        let matchStaffList = existStaff.filter((s) => { return (s._id == staffId); });
        if (matchStaffList.length == 1) {
            staff = matchStaffList[0];
        }
        else {
            retValue = false;
            addCellComment(row, 31, warningInvalid);
            staff = new staff_model_1.Staff();
        }
    }
    else {
        staff = new staff_model_1.Staff();
    }
    // for(let i=0; i<31; i++){
    //     if(!row.getCell(i+1)){
    //         row
    //     }
    // }
    staff.staffnumber = getCellContent(row, 1);
    staff.firstname = getCellContent(row, 2);
    staff.lastname = getCellContent(row, 3);
    staff.middlename = getCellContent(row, 4);
    staff.chinesename = getCellContent(row, 5);
    staff.bank = getCellContent(row, 6);
    staff.bankaccount = getCellContent(row, 7);
    staff.nameofbankaccountholder = getCellContent(row, 8);
    //staff = getCellContent(row, 9);   //Signed contract in KT office (Y/N)
    //staff = getCellContent(row, 10);  //HKID copy  in KT office (Y/N)
    staff.personalemailaddress = getCellContent(row, 11);
    // staff.staffnumber = getCellContent(row, 12);    // Signed Code of Conduct
    // staff.staffnumber = getCellContent(row, 13);    // TAX Return 2019-2020 (Y=1)	
    // staff.staffnumber = getCellContent(row, 14);    // Date of Join
    // staff.staffnumber = getCellContent(row, 15);    // Last Day of Employment
    staff.bupamembershipnumber = getCellContent(row, 16);
    staff.bupamedicalplancategory = getCellContent(row, 17);
    staff.staffcardissued = getCellContent(row, 18) == "Y";
    staff.dateofbirth = Date.parse(getCellContent(row, 19)) ? new Date(getCellContent(row, 19)) : undefined;
    staff.hkidnumber = getCellContent(row, 20);
    staff.gender = getCellContent(row, 21);
    staff.maritalstatus = getCellContent(row, 22);
    staff.residentialaddress = getCellContent(row, 23);
    staff.title = getCellContent(row, 24);
    staff.hkmobile = getCellContent(row, 25);
    staff.chinamobile = getCellContent(row, 26);
    staff.igsemailaddress = getCellContent(row, 27);
    staff.personalemailaddress = getCellContent(row, 28);
    let nextOfKinUnfo = getCellContent(row, 29).split("-");
    if (nextOfKinUnfo.length == 3) {
        let emergencycontact = {
            name: nextOfKinUnfo[0],
            phonenumber: nextOfKinUnfo[1],
            relationship: nextOfKinUnfo[2]
        };
        staff.emergencycontact = emergencycontact;
    }
    staff.referralby = getCellContent(row, 30);
    //staff._id = staffId;
    importStaff.push(staff);
    //Checking Start
    //Staff Number
    retValue = checkNonEmpty(staff.staffnumber, row, 1, retValue);
    retValue = checkUnique(staff, existStaff.concat(importStaff), row, 1, retValue);
    //retValue = checkUnique(staff, importStaff, row, 1, retValue);
    //bank
    retValue = checkExist(staff.bank, banks, row, 6, retValue);
    //IGS Email
    retValue = checkEmailFormat(staff.igsemailaddress, row, 27, retValue);
    //Personal Email
    retValue = checkEmailFormat(staff.personalemailaddress, row, 28, retValue);
    //Emergency Contact
    retValue = checkSegmentCount(getCellContent(row, 29), "-", 3, row, 29, retValue);
    return retValue;
};
const checkSegmentCount = (value, splitter, count, row, columnNo, oldReturn) => {
    let retValue = oldReturn;
    if (value) {
        if (value.split(splitter).length != count) {
            retValue = false;
            addCellComment(row, columnNo, warningInvalid);
        }
    }
    return retValue;
};
const checkEmailFormat = (value, row, columnNo, oldReturn) => {
    let retValue = oldReturn;
    let regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value) {
        if (!regexp.test(value)) {
            retValue = false;
            addCellComment(row, columnNo, warningInvalid);
        }
    }
    return retValue;
};
const checkExist = (value, acceptList, row, columnNo, oldReturn) => {
    let retValue = oldReturn;
    if (value) {
        if (acceptList.filter((s) => { return ((s.code == value)); }).length == 0) {
            retValue = false;
            addCellComment(row, columnNo, warningInvalid);
        }
    }
    return retValue;
};
const checkUnique = (staff, stafflist, row, columnNo, oldReturn) => {
    let retValue = oldReturn;
    console.log("staff list length:" + stafflist.length);
    if (staff.staffnumber) {
        let sameStaffList = stafflist.filter((s) => { return ((s.staffnumber == staff.staffnumber) && (s._id.toString() != staff._id.toString())); });
        if (sameStaffList.length > 0) {
            retValue = false;
            addCellComment(row, columnNo, warningUnique);
        }
    }
    return retValue;
};
const checkNonEmpty = (value, row, columnNo, oldReturn) => {
    let retValue = oldReturn;
    if (!value) {
        addCellComment(row, columnNo, warningNonEmpty);
        retValue = false;
    }
    return retValue;
};
const getCellContent = (row, columnNo) => {
    let retValue;
    let cell = row.getCell(columnNo);
    retValue = cell.text;
    return retValue;
};
const addCellComment = (row, columnNo, comment) => {
    let cell = row.getCell(columnNo);
    console.log("addComment: " + columnNo);
    if (!cell.note) {
        cell.note = { texts: [] };
    }
    cell.note.texts.push({ text: comment });
    cell.style = JSON.parse(JSON.stringify(cell.style));
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' }, bgColor: { argb: 'FFFFFF00' } }; //Fill yellow background
};
const loadandCheckFormat = (importFile, templateType) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // let importFile = await Uploadfile.findById(fileId);
            if (!(importFile === null || importFile === void 0 ? void 0 : importFile.content)) {
                throw (new Error("Import file not found"));
            }
            let templateFile = yield uploadfile_model_1.Uploadfile.findOne({ template: common_model_1.FileTemplate.Staff });
            if (!(templateFile === null || templateFile === void 0 ? void 0 : templateFile.content)) {
                throw (new Error("Template file not found"));
            }
            let importBook = new excel.Workbook();
            yield importBook.xlsx.load(importFile.content);
            let importSheet = importBook.getWorksheet(sheetName);
            let templateBook = new excel.Workbook();
            yield templateBook.xlsx.load(templateFile.content);
            let templateSheet = templateBook.getWorksheet(sheetName);
            if (!(yield rowMatched(importSheet, templateSheet, 1))) {
                throw (new Error("File format not match"));
            }
            resolve(importSheet);
        }
        catch (error) {
            reject(error);
        }
    }));
});
const rowMatched = (sheet1, sheet2, RowId) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        let S1Row = sheet1.getRow(RowId).values.toString();
        let S2Row = sheet2.getRow(RowId).values.toString();
        if (S1Row == S2Row) {
            resolve(true);
        }
        else {
            resolve(false);
        }
    }));
});
const generateStaffListFile = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let templateFile = yield uploadfile_model_1.Uploadfile.findOne({ template: common_model_1.FileTemplate.Staff });
            if (templateFile) {
                let allStaff = yield staff_model_1.Staff.find();
                let exportFile = new uploadfile_model_1.Uploadfile();
                let now = new Date();
                exportFile.originalname = `Staff List.xlsx`;
                exportFile.encoding = templateFile.encoding;
                exportFile.mimetype = templateFile.mimetype;
                exportFile.lastmodified = now;
                exportFile.isvalid = true;
                let workbook = new excel.Workbook();
                yield workbook.xlsx.load(templateFile.content);
                let worksheet = workbook.getWorksheet(sheetName);
                if (worksheet) {
                    allStaff.forEach((staff) => {
                        var _a;
                        let rowValues = [];
                        rowValues[1] = staff.staffnumber; //Staff No.	
                        rowValues[2] = staff.firstname; // First Name
                        rowValues[3] = staff.lastname; // Last Name	
                        rowValues[4] = staff.middlename; // Middle Name	
                        rowValues[5] = staff.chinesename; // Chinese Name (as shown in HKID card)	
                        rowValues[6] = staff.bank; // Bank	
                        rowValues[7] = staff.bankaccount; // Bank Account	
                        rowValues[8] = staff.nameofbankaccountholder; // Name of Bank Account Holder
                        rowValues[9] = ""; //Signed contract in KT office (Y/N)
                        rowValues[10] = ""; //HKID copy  in KT office (Y/N)
                        rowValues[11] = staff.personaldetails; //Personal Details (Y/N)
                        rowValues[12] = ""; // Signed Code of Conduct	
                        rowValues[13] = ""; // TAX Return 2019-2020 (Y=1)	
                        rowValues[14] = ""; // Date of Join
                        rowValues[15] = ""; // Last Day of Employment
                        rowValues[16] = staff.bupamembershipnumber; // Bupa Membership No. 01518800- 
                        rowValues[17] = staff.bupamedicalplancategory; // Bupa Medical Plan (Category)
                        rowValues[18] = staff.staffcardissued; // Staff Card (Y/N)
                        rowValues[19] = (staff.dateofbirth) ? dateformat_1.default(staff.dateofbirth, exportDateOnlyFormat) : ""; // Date of Birth
                        rowValues[20] = staff.hkidnumber; // HKID #
                        rowValues[21] = staff.gender; // Sex (M=Male, F=Female)
                        rowValues[22] = staff.maritalstatus; // Marital Status (1=Single/Widowed/Divorced/Living Apart, 2=Married)
                        rowValues[23] = staff.residentialaddress; // Residential Address
                        rowValues[24] = staff.title; // Title
                        rowValues[25] = staff.hkmobile; // HK Mobile
                        rowValues[26] = staff.chinamobile; // China Mobile
                        rowValues[27] = staff.igsemailaddress; // IGS Email Address
                        rowValues[28] = staff.personalemailaddress; // Personal Email Address
                        rowValues[29] = ((_a = staff.emergencycontact) === null || _a === void 0 ? void 0 : _a.name) ? (staff.emergencycontact.name + "-" + staff.emergencycontact.phonenumber + "-" + staff.emergencycontact.relationship) : ""; // Emergency Contact, please state relationship	
                        rowValues[30] = staff.referralby; // Referral by:
                        rowValues[31] = staff._id.toString();
                        worksheet.addRow(rowValues);
                    });
                    exportFile.content = yield workbook.xlsx.writeBuffer();
                    yield exportFile.save();
                    resolve(exportFile._id);
                }
                else {
                    throw (new Error("Invalid worksheet"));
                }
            }
            else {
                throw (new Error("No template file is configured"));
            }
        }
        catch (error) {
            reject(error);
        }
    }));
});
//# sourceMappingURL=staffio.route.js.map