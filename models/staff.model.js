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
const opts = { toJSON: { virtuals: true } };
const emergencyContactSchema = new mongoose_1.Schema({
    name: { type: String },
    relationship: { type: String },
    phonenumber: { type: String }
});
const noteSchema = new mongoose_1.Schema({
    createdbyuser: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: false },
    createtime: { type: Date },
    message: { type: String }
});
const employmentSchema = new mongoose_1.Schema({
    hkidcopyinktoffice: { type: Boolean },
    signedcontractinktoffice: { type: Boolean },
    signedcodeofconduct: { type: Boolean },
    effectivestartdate: { type: Date, required: true },
    effectiveenddate: { type: Date },
    employmenttype: { type: String },
    position: { type: String },
    department: { type: mongoose_1.Schema.Types.ObjectId, ref: "departments" },
    manager: { type: mongoose_1.Schema.Types.ObjectId, ref: "Staff" },
    location: { type: mongoose_1.Schema.Types.ObjectId, ref: "Location" },
    salarycurrency: { type: String },
    salary: { type: String },
    salarytype: { type: String },
});
const staffSchema = new mongoose_1.Schema({
    staffnumber: { type: String, required: true, unique: true },
    staffphoto: { type: mongoose_1.Schema.Types.ObjectId, ref: "UploadFile", required: false },
    firstname: { type: String },
    lastname: { type: String },
    middlename: { type: String },
    chinesename: { type: String },
    bank: { type: String },
    bankaccount: { type: String },
    nameofbankaccountholder: { type: String },
    personaldetails: { type: String },
    bupamembershipnumber: { type: String },
    bupamedicalplancategory: { type: String },
    staffcardissued: { type: Boolean },
    dateofbirth: { type: Date },
    lastdateofemployment: { type: Date },
    hkidnumber: { type: String },
    gender: { type: String },
    maritalstatus: { type: String },
    residentialaddress: { type: String },
    title: { type: String },
    hkmobile: { type: String },
    chinamobile: { type: String },
    igsemailaddress: { type: String },
    personalemailaddress: { type: String },
    attachments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "UploadFile", required: false }],
    emergencycontact: { type: emergencyContactSchema },
    notes: [{ type: noteSchema }],
    referralby: { type: String },
    employments: [{ type: employmentSchema }],
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: false }
}, opts);
staffSchema.virtual("displayname").get(function () {
    var _a, _b;
    var dn = `${(_a = this.firstname) !== null && _a !== void 0 ? _a : ""} ${(_b = this.lastname) !== null && _b !== void 0 ? _b : ""}`.trim();
    if ((this.firstname != undefined || this.lastname != undefined) && dn != "") {
        return dn;
    }
    else {
        return "no name";
    }
});
staffSchema.virtual("lastEmployment").get(function () {
    if (this.employments == undefined || this.employments.length == 0)
        return null;
    return this.employments.sort((em1, em2) => em1.effectivestartdate > em2.effectivestartdate ? -1 : 1)[0];
    //.find(em=>em.effectivestartdate <= today && (em.effectiveenddate == null || em.effectiveenddate > today));
});
;
;
;
exports.Staff = mongoose_1.default.model('Staff', staffSchema);
//# sourceMappingURL=staff.model.js.map