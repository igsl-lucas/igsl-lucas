"use strict";
// This file is used to store all common constants and enum among projects, including frontend and backend
Object.defineProperty(exports, "__esModule", { value: true });
// Enum
var Language;
(function (Language) {
    Language["en"] = "en";
    Language["tch"] = "tch";
    Language["sch"] = "sch";
})(Language = exports.Language || (exports.Language = {}));
var FileTemplate;
(function (FileTemplate) {
    FileTemplate[FileTemplate["none"] = 0] = "none";
    FileTemplate[FileTemplate["Staff"] = 1] = "Staff";
})(FileTemplate = exports.FileTemplate || (exports.FileTemplate = {}));
var UserInfoFormat;
(function (UserInfoFormat) {
    UserInfoFormat["Tag"] = "format";
    UserInfoFormat["PersonalBasic"] = "0";
    UserInfoFormat["NameList"] = "1";
})(UserInfoFormat = exports.UserInfoFormat || (exports.UserInfoFormat = {}));
var UserPostType;
(function (UserPostType) {
    UserPostType["TypePortrait"] = "portrait";
    UserPostType["TypePassword"] = "password";
    UserPostType["TypeForceOut"] = "ForceOut";
})(UserPostType = exports.UserPostType || (exports.UserPostType = {}));
var StaffPostType;
(function (StaffPostType) {
    StaffPostType["TypeExportList"] = "exportlist";
    StaffPostType["TypeImportList"] = "importlist";
})(StaffPostType = exports.StaffPostType || (exports.StaffPostType = {}));
var QueryTag;
(function (QueryTag) {
    QueryTag["TagID"] = "id";
    QueryTag["TagCode"] = "code";
    QueryTag["TagCount"] = "count";
    QueryTag["TagEmail"] = "email";
    QueryTag["TagCanUse"] = "canuse";
    QueryTag["TagGetFile"] = "getfile";
    QueryTag["TagGetImage"] = "getimage";
    QueryTag["ValueYes"] = "1";
    QueryTag["ValueNo"] = "0";
})(QueryTag = exports.QueryTag || (exports.QueryTag = {}));
var EventResult;
(function (EventResult) {
    EventResult["success"] = "Result: success";
    EventResult["failed"] = "Result: failed";
})(EventResult = exports.EventResult || (exports.EventResult = {}));
var NotifyType;
(function (NotifyType) {
    NotifyType["error"] = "error";
    NotifyType["warning"] = "warning";
    NotifyType["info"] = "info";
    NotifyType["success"] = "success";
})(NotifyType = exports.NotifyType || (exports.NotifyType = {}));
var SpecialID;
(function (SpecialID) {
    SpecialID["NewID"] = "new";
})(SpecialID = exports.SpecialID || (exports.SpecialID = {}));
var HRISModule;
(function (HRISModule) {
    HRISModule["none"] = "*";
    HRISModule["login"] = "login";
    HRISModule["forgotpassword"] = "login/forgot";
    HRISModule["resetpassword"] = "login/reset";
    HRISModule["userinvitation"] = "login/invite";
    HRISModule["dashboard"] = "dashboard";
    HRISModule["company"] = "company";
    HRISModule["location"] = "location";
    HRISModule["department"] = "department";
    HRISModule["masteritem"] = "masteritem";
    HRISModule["staff"] = "staff";
    HRISModule["alertrules"] = "alertrules";
    HRISModule["userprofile"] = "userprofile";
    HRISModule["eventviewer"] = "eventviewer";
    HRISModule["user"] = "user";
})(HRISModule = exports.HRISModule || (exports.HRISModule = {}));
var APIEndPoint;
(function (APIEndPoint) {
    APIEndPoint["login"] = "login";
    APIEndPoint["forgotpassword"] = "forgotpassword";
    APIEndPoint["resetpassword"] = "resetpassword";
    APIEndPoint["userinvitation"] = "userinvitation";
    APIEndPoint["company"] = "company";
    APIEndPoint["userinfo"] = "userinfo";
    APIEndPoint["refreshtoken"] = "refreshtoken";
    APIEndPoint["changepassword"] = "changepassword";
    APIEndPoint["location"] = "location";
    APIEndPoint["department"] = "department";
    APIEndPoint["masteritem"] = "masteritem";
    APIEndPoint["opevent"] = "opevent";
    APIEndPoint["upload"] = "upload";
    APIEndPoint["user"] = "user";
    APIEndPoint["staff"] = "staff";
    APIEndPoint["staffio"] = "staffio";
    APIEndPoint["alertrules"] = "alertrules";
    APIEndPoint["alertitems"] = "alertitems";
    APIEndPoint["role"] = "role";
})(APIEndPoint = exports.APIEndPoint || (exports.APIEndPoint = {}));
var APIVer;
(function (APIVer) {
    APIVer["V1"] = "v1";
})(APIVer = exports.APIVer || (exports.APIVer = {}));
var APIMethod;
(function (APIMethod) {
    APIMethod["get"] = "get";
    APIMethod["post"] = "post";
    APIMethod["put"] = "put";
    APIMethod["patch"] = "patch";
    APIMethod["delete"] = "delete";
})(APIMethod = exports.APIMethod || (exports.APIMethod = {}));
var HRISAccessRight;
(function (HRISAccessRight) {
    HRISAccessRight["nocontrol"] = "-";
    HRISAccessRight["read"] = "r";
    HRISAccessRight["update"] = "u";
    HRISAccessRight["create"] = "c";
    HRISAccessRight["delete"] = "d";
    HRISAccessRight["print"] = "p";
})(HRISAccessRight = exports.HRISAccessRight || (exports.HRISAccessRight = {}));
var HRISAccessScope;
(function (HRISAccessScope) {
    HRISAccessScope["all"] = "all";
    HRISAccessScope["team"] = "team";
    HRISAccessScope["own"] = "own";
})(HRISAccessScope = exports.HRISAccessScope || (exports.HRISAccessScope = {}));
var LSKey;
(function (LSKey) {
    LSKey["UserId"] = "USER_ID";
    LSKey["AccessKey"] = "ACCESS_KEY";
    LSKey["RefreshKey"] = "REFRESH_KEY";
})(LSKey = exports.LSKey || (exports.LSKey = {}));
var LogLevel;
(function (LogLevel) {
    LogLevel["silly"] = "silly";
    LogLevel["debug"] = "debug";
    LogLevel["http"] = "http";
    LogLevel["verbose"] = "verbose";
    LogLevel["info"] = "info";
    LogLevel["warn"] = "warn";
    LogLevel["error"] = "error";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
//# sourceMappingURL=common.model.js.map