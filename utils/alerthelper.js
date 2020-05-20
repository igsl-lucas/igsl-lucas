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
const alertrules_model_1 = require("../models/alertrules.model");
const dotenv_1 = require("dotenv");
const staff_model_1 = require("../models/staff.model");
const mailhelper_1 = require("./mailhelper");
const errorhandler_1 = require("./errorhandler");
const department_model_1 = require("../models/department.model");
const user_model_1 = require("../models/user.model");
const alertrules_model_2 = require("../common/alertrules.model");
const moduleName = 'Helper - AlertItem';
dotenv_1.config();
exports.genAlert = () => __awaiter(void 0, void 0, void 0, function* () {
    let now = Date.now();
    const alertRules = yield alertrules_model_1.AlertRules.find({ $and: [{ enable: true }, { 'condition.periodfr': { $lte: now } }, { 'condition.periodto': { $gte: now } }] });
    alertRules.forEach((currAlertRule) => __awaiter(void 0, void 0, void 0, function* () {
        let alertItems = [];
        switch (currAlertRule.condition.type) {
            case alertrules_model_2.AlertConditionType.customTime:
                let startDate = new Date(currAlertRule.condition.periodfr).setHours(0, 0, 0, 0);
                now = new Date().setHours(0, 0, 0, 0);
                let triggerFlag = false;
                var nowDay = new Date(now).getDate();
                var nowMonth = new Date(now).getMonth();
                var nowYear = new Date(now).getFullYear();
                var triggerDay = new Date(startDate).getDate();
                var triggerMonth = new Date(startDate).getMonth();
                var triggerYear = new Date(startDate).getFullYear();
                switch (currAlertRule.condition.repeatfreq) {
                    case alertrules_model_2.AlertDateType.day:
                        if ((now - startDate) % (currAlertRule.condition.repeatat * (24 * 60 * 60 * 1000)) == 0) {
                            triggerFlag = true;
                        }
                        break;
                    case alertrules_model_2.AlertDateType.week:
                        if ((now - startDate) % (currAlertRule.condition.repeatat * (7 * 24 * 60 * 60 * 1000)) == 0) {
                            triggerFlag = true;
                        }
                        break;
                    case alertrules_model_2.AlertDateType.month:
                        var totalMonth = ((nowYear - triggerYear) * 12) + (nowMonth - triggerMonth);
                        if (totalMonth % currAlertRule.condition.repeatat == 0) {
                            if (nowDay > triggerDay) {
                                triggerFlag = true;
                            }
                        }
                        break;
                    case alertrules_model_2.AlertDateType.year:
                        var totalYear = (nowYear - triggerYear);
                        if (totalYear % currAlertRule.condition.repeatat == 0) {
                            if (nowMonth > triggerMonth && nowDay > triggerDay) {
                                triggerFlag = true;
                            }
                        }
                        break;
                }
                if (triggerFlag) {
                    var currAlertItem = {};
                    currAlertItem.alertTo = {};
                    var _day = new Date(now).getDate();
                    var _month = new Date(now).getMonth();
                    var _year = new Date(now).getFullYear();
                    currAlertItem.aid = currAlertRule._id;
                    currAlertItem.name = currAlertRule.name;
                    currAlertItem.date = now;
                    currAlertItem.subject = currAlertRule.message.subject;
                    currAlertItem.content = currAlertRule.message.content;
                    currAlertItem.alertmth = currAlertRule.message.alertmth;
                    currAlertItem.status = alertrules_model_2.AlertItemStatus.new;
                    currAlertItem.subject = currAlertItem.subject.replace(alertrules_model_2.AlertVariable.date, _year + "-" + (_month + 1) + "-" + _day);
                    currAlertItem.subject = currAlertItem.subject.replace(alertrules_model_2.AlertVariable.date, _year + "-" + (_month + 1) + "-" + _day);
                    currAlertItem.content = currAlertItem.content.replace(alertrules_model_2.AlertVariable.date, _year + "-" + (_month + 1) + "-" + _day);
                    currAlertItem.content = currAlertItem.content.replace(alertrules_model_2.AlertVariable.date, _year + "-" + (_month + 1) + "-" + _day);
                    if (currAlertRule.condition.outstanding) {
                        switch (currAlertRule.condition.overfreq) {
                            case alertrules_model_2.AlertDateType.day:
                                currAlertItem.outdate = now + (currAlertRule.condition.overat * (24 * 60 * 60 * 1000));
                                break;
                            case alertrules_model_2.AlertDateType.week:
                                currAlertItem.outdate = now + (currAlertRule.condition.overat * (7 * 24 * 60 * 60 * 1000));
                                break;
                            case alertrules_model_2.AlertDateType.month:
                                currAlertItem.outdate = new Date(_year, _month + currAlertRule.condition.overat, _day).getTime();
                                break;
                            case alertrules_model_2.AlertDateType.year:
                                currAlertItem.outdate = new Date(_year + currAlertRule.condition.overat, _month, _day).getTime();
                                break;
                        }
                    }
                    alertItems[alertItems.length] = currAlertItem;
                }
                break;
            default:
                let applyStaff = [];
                var deptQuery = { status: true };
                if (!currAlertRule.condition.alldept) {
                    deptQuery = { $and: [{ _id: { $in: currAlertRule.condition.apply_dept } }, { status: true }] };
                }
                var applyDept = [];
                yield department_model_1.Department.find(deptQuery).then(function (data) {
                    data.forEach(dept => {
                        applyDept[applyDept.length] = dept._id;
                    });
                });
                yield staff_model_1.Staff.find({}).then(function (data) {
                    data.forEach(staff => {
                        if (!currAlertRule.condition.allstaff) {
                            if (currAlertRule.condition.applystaff.findIndex(element => element.toString() == staff._id.toString()) != -1) {
                                applyStaff[applyStaff.length] = staff;
                                return true;
                            }
                        }
                        else {
                            applyStaff[applyStaff.length] = staff;
                            return true;
                        }
                        if (staff.employments != null) {
                            var lastEmployment = staff.employments.sort((em1, em2) => em1.effectivestartdate > em2.effectivestartdate ? -1 : 1)[0];
                            if (lastEmployment) {
                                if (applyDept.findIndex(element => { var _a; return element.toString() == ((_a = lastEmployment.department) === null || _a === void 0 ? void 0 : _a.toString()); }) != -1) {
                                    applyStaff[applyStaff.length] = staff;
                                    return true;
                                }
                            }
                        }
                    });
                });
                applyStaff.forEach((staff) => __awaiter(void 0, void 0, void 0, function* () {
                    let triggerDate = 0;
                    switch (currAlertRule.condition.type) {
                        case alertrules_model_2.AlertConditionType.employmentDate:
                            if (staff.employments) {
                                var lastEmployment = staff.employments.sort((em1, em2) => em1.effectivestartdate > em2.effectivestartdate ? -1 : 1)[0];
                                triggerDate = new Date(lastEmployment.effectivestartdate || 0).getTime();
                            }
                            break;
                        case alertrules_model_2.AlertConditionType.contractEndDate:
                            if (staff.employments) {
                                var lastEmployment = staff.employments.sort((em1, em2) => em1.effectivestartdate > em2.effectivestartdate ? -1 : 1)[0];
                                triggerDate = new Date(lastEmployment.effectiveenddate || 0).getTime();
                            }
                            break;
                        case alertrules_model_2.AlertConditionType.birthday:
                            triggerDate = new Date(staff.dateofbirth || 0).getTime();
                            triggerDate = new Date(triggerDate).setFullYear(new Date(now).getFullYear());
                            if (now > triggerDate) {
                                triggerDate = new Date(triggerDate).setFullYear(new Date(now).getFullYear() + 1);
                            }
                            break;
                        case alertrules_model_2.AlertConditionType.leave:
                            break;
                    }
                    var _day = new Date(triggerDate).getDate();
                    var _month = new Date(triggerDate).getMonth();
                    var _year = new Date(triggerDate).getFullYear();
                    switch (currAlertRule.condition.repeatfreq) {
                        case alertrules_model_2.AlertDateType.day:
                            triggerDate = triggerDate + (currAlertRule.condition.repeatat * (24 * 60 * 60 * 1000) * parseInt(currAlertRule.condition.repeattype));
                            break;
                        case alertrules_model_2.AlertDateType.week:
                            triggerDate = triggerDate + (currAlertRule.condition.repeatat * (7 * 24 * 60 * 60 * 1000) * parseInt(currAlertRule.condition.repeattype));
                            break;
                        case alertrules_model_2.AlertDateType.month:
                            triggerDate = new Date(_year, _month + (currAlertRule.condition.repeatat * parseInt(currAlertRule.condition.repeattype)), _day).getTime();
                            break;
                        case alertrules_model_2.AlertDateType.year:
                            triggerDate = new Date(_year + (currAlertRule.condition.repeatat * parseInt(currAlertRule.condition.repeattype)), _month, _day).getTime();
                            break;
                    }
                    if (now >= triggerDate && triggerDate != 0) {
                        var currAlertItem = {};
                        currAlertItem.alertTo = {};
                        currAlertItem.aid = currAlertRule._id;
                        currAlertItem.name = currAlertRule.name;
                        currAlertItem.date = triggerDate;
                        currAlertItem.applyTo = staff._id;
                        currAlertItem.subject = currAlertRule.message.subject;
                        currAlertItem.content = currAlertRule.message.content;
                        currAlertItem.alertmth = currAlertRule.message.alertmth;
                        currAlertItem.status = alertrules_model_2.AlertItemStatus.new;
                        currAlertItem.subject = currAlertItem.subject.replace(alertrules_model_2.AlertVariable.staffname, staff.displayname || "");
                        currAlertItem.subject = currAlertItem.subject.replace(alertrules_model_2.AlertVariable.staffno, staff.staffnumber || "");
                        currAlertItem.content = currAlertItem.content.replace(alertrules_model_2.AlertVariable.staffname, staff.displayname || "");
                        currAlertItem.content = currAlertItem.content.replace(alertrules_model_2.AlertVariable.staffno, staff.staffnumber || "");
                        if (currAlertRule.condition.outstanding) {
                            switch (currAlertRule.condition.overfreq) {
                                case alertrules_model_2.AlertDateType.day:
                                    currAlertItem.outdate = triggerDate + (currAlertRule.condition.overat * (24 * 60 * 60 * 1000));
                                    break;
                                case alertrules_model_2.AlertDateType.week:
                                    currAlertItem.outdate = triggerDate + (currAlertRule.condition.overat * (7 * 24 * 60 * 60 * 1000));
                                    break;
                                case alertrules_model_2.AlertDateType.month:
                                    currAlertItem.outdate = new Date(_year, _month + currAlertRule.condition.overat, _day).getTime();
                                    break;
                                case alertrules_model_2.AlertDateType.year:
                                    currAlertItem.outdate = new Date(_year + currAlertRule.condition.overat, _month, _day).getTime();
                                    break;
                            }
                        }
                        alertItems[alertItems.length] = currAlertItem;
                    }
                }));
                break;
        }
        //#region User
        let alertUser = [];
        yield user_model_1.User.find({}).then(function (data) {
            data.forEach(user => {
                if (!currAlertRule.message.alluser) {
                    if (currAlertRule.message.alertuser.findIndex(element => element.toString() == user._id.toString()) != -1) {
                        alertUser[alertUser.length] = user;
                        return true;
                    }
                }
                else {
                    alertUser[alertUser.length] = user;
                    return true;
                }
            });
        });
        saveAlertUser(alertItems, alertUser);
        //#endregion
        //#region Dept.
        var alertDept = [];
        var deptQuery = { status: true };
        if (!currAlertRule.message.alldept) {
            deptQuery = { $and: [{ _id: { $in: currAlertRule.message.alertdept } }, { status: true }] };
        }
        yield department_model_1.Department.find(deptQuery).then(function (data) {
            data.forEach(dept => {
                alertDept[alertDept.length] = dept._id;
            });
        });
        saveAlertDept(alertItems, alertDept);
        //#endregion
    }));
    //TODO lucas 2020515 bug fix
    // //#region Outstanding Alert
    // const outstandingQuery = { $and: [{ outdate: { $exists: true } }, { 'outdate': { $lte: now } }, { status: AlertItemStatus.new }, { 'alertTo.alerttype': AlertToType.user }, { alertmth: { "$regex": AlertMsgType.email, "$options": "i" } }] }
    // AlertItems.find(outstandingQuery).then(function (data) {
    //     data.forEach(async currAlertItem => {
    //         let user = await User.findById(currAlertItem.alertTo.alerttoid)
    //         if (user) {
    //             let newMail = {} as IMailItem
    //             newMail.from = "noreply@igsl-group.com";
    //             newMail.to = user.email;
    //             newMail.subject = currAlertItem.subject;
    //             newMail.html = currAlertItem.content;
    //             sendMail(newMail).then()
    //                 .catch((reason) =>
    //                     CreateErr(HTTPStatus.INTERNAL_SERVER_ERROR, reason, moduleName)
    //                 )
    //         }
    //     })
    // })
    // //#endregion
});
function saveAlertUser(alertItems, alertUser) {
    alertUser.forEach(user => {
        alertItems.forEach((currAlertItem) => __awaiter(this, void 0, void 0, function* () {
            if (!(yield alertrules_model_1.AlertItems.findOne({ $and: [{ aid: currAlertItem.aid }, { date: currAlertItem.date }, { 'alertTo.alerttoid': currAlertItem.alertTo.alerttoid }] }))) {
                currAlertItem.alertTo.alerttype = alertrules_model_2.AlertToType.user;
                currAlertItem.alertTo.alerttoid = user._id;
                alertrules_model_1.AlertItems.create(currAlertItem);
                if (currAlertItem.alertmth.search(alertrules_model_2.AlertMsgType.email) != -1) {
                    let newMail = {};
                    newMail.from = "noreply@igsl-group.com";
                    newMail.to = user.email;
                    newMail.subject = currAlertItem.subject;
                    newMail.html = currAlertItem.content;
                    mailhelper_1.sendMail(newMail).then()
                        .catch((reason) => errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, reason, moduleName));
                }
            }
        }));
    });
}
function saveAlertDept(alertItems, alertDept) {
    alertDept.forEach((dept) => __awaiter(this, void 0, void 0, function* () {
        let currDepartment = department_model_1.Department.findOne({ $and: [{ _id: dept._id }, { status: true }] });
        if (currDepartment == null) {
            return true;
        }
        alertItems.forEach((currAlertItem) => __awaiter(this, void 0, void 0, function* () {
            if (!(yield alertrules_model_1.AlertItems.findOne({ $and: [{ aid: currAlertItem.aid }, { date: currAlertItem.date }, { 'alertTo.alerttoid': currAlertItem.alertTo.alerttoid }] }))) {
                currAlertItem.alertTo.alerttype = alertrules_model_2.AlertToType.dept;
                currAlertItem.alertTo.alerttoid = dept;
                alertrules_model_1.AlertItems.create(currAlertItem);
                if (currAlertItem.alertmth.search(alertrules_model_2.AlertMsgType.email) != -1) {
                    let alertUser = [];
                    yield staff_model_1.Staff.find({ $and: [{ user: { $exists: true, $ne: null } }, { 'employments.department': dept._id }] }).populate("user").then(function (data) {
                        data.forEach(staff => {
                            if (staff.lastEmployment.department.toString() == dept._id.toString()) {
                                if (staff.user) {
                                    if (alertUser.findIndex(user => user.id.toString() == staff.user.id.toString()) == -1) {
                                        alertUser.push(staff.user);
                                    }
                                }
                            }
                        });
                    });
                    alertUser.forEach(user => {
                        let newMail = {};
                        newMail.from = "noreply@igsl-group.com";
                        newMail.to = user.email;
                        newMail.subject = currAlertItem.subject;
                        newMail.html = currAlertItem.content;
                        mailhelper_1.sendMail(newMail).then()
                            .catch((reason) => errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, reason, moduleName));
                    });
                }
            }
        }));
    }));
}
//# sourceMappingURL=alerthelper.js.map