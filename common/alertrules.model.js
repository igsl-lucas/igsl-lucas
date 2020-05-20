"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AlertMsgType;
(function (AlertMsgType) {
    AlertMsgType["email"] = "email;";
    AlertMsgType["system"] = "system;";
})(AlertMsgType = exports.AlertMsgType || (exports.AlertMsgType = {}));
var AlertDateType;
(function (AlertDateType) {
    AlertDateType["day"] = "day";
    AlertDateType["week"] = "week";
    AlertDateType["month"] = "month";
    AlertDateType["year"] = "year";
})(AlertDateType = exports.AlertDateType || (exports.AlertDateType = {}));
var AlertItemStatus;
(function (AlertItemStatus) {
    AlertItemStatus["new"] = "new";
    AlertItemStatus["handling"] = "handling";
    AlertItemStatus["halt"] = "halt";
    AlertItemStatus["completed"] = "completed";
    AlertItemStatus["ignored"] = "ignored";
    AlertItemStatus["deleted"] = "deleted";
})(AlertItemStatus = exports.AlertItemStatus || (exports.AlertItemStatus = {}));
var AlertConditionType;
(function (AlertConditionType) {
    AlertConditionType["customTime"] = "customTime";
    AlertConditionType["employmentDate"] = "employmentDate";
    AlertConditionType["contractEndDate"] = "contractEndDate";
    AlertConditionType["birthday"] = "birthday";
    AlertConditionType["leave"] = "leave";
})(AlertConditionType = exports.AlertConditionType || (exports.AlertConditionType = {}));
var AlertVariable;
(function (AlertVariable) {
    AlertVariable["staffno"] = "{staffno}";
    AlertVariable["staffname"] = "{staffname}";
    AlertVariable["date"] = "{date}";
})(AlertVariable = exports.AlertVariable || (exports.AlertVariable = {}));
var AlertToType;
(function (AlertToType) {
    AlertToType["user"] = "user";
    AlertToType["dept"] = "dept";
})(AlertToType = exports.AlertToType || (exports.AlertToType = {}));
//# sourceMappingURL=alertrules.model.js.map