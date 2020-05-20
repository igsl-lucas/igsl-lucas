"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorhandler_1 = require("./errorhandler");
const common_model_1 = require("../common/common.model");
const user_model_1 = require("../models/user.model");
const moduleName = 'Authentication Check';
const rightNeeds = new Map();
//#region Login Related
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.login}-${common_model_1.APIMethod.post}`.toLowerCase(), { module: common_model_1.HRISModule.none, rightneed: [] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.refreshtoken}-${common_model_1.APIMethod.post}`.toLowerCase(), { module: common_model_1.HRISModule.none, rightneed: [] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.changepassword}-${common_model_1.APIMethod.post}`.toLowerCase(), { module: common_model_1.HRISModule.none, rightneed: [common_model_1.HRISAccessRight.read] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.forgotpassword}-${common_model_1.APIMethod.post}`.toLowerCase(), { module: common_model_1.HRISModule.none, rightneed: [] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.resetpassword}-${common_model_1.APIMethod.put}`.toLowerCase(), { module: common_model_1.HRISModule.none, rightneed: [] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.resetpassword}-${common_model_1.APIMethod.get}`.toLowerCase(), { module: common_model_1.HRISModule.none, rightneed: [] });
//#endregion
//User
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.user}-${common_model_1.APIMethod.post}`.toLowerCase(), { module: common_model_1.HRISModule.none, rightneed: [common_model_1.HRISAccessRight.read] });
// Post is for user portrait update and so every login user can access
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.user}-${common_model_1.APIMethod.get}`.toLowerCase(), { module: common_model_1.HRISModule.user, rightneed: [common_model_1.HRISAccessRight.read] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.user}-${common_model_1.APIMethod.put}`.toLowerCase(), { module: common_model_1.HRISModule.user, rightneed: [common_model_1.HRISAccessRight.update] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.user}-${common_model_1.APIMethod.delete}`.toLowerCase(), { module: common_model_1.HRISModule.user, rightneed: [common_model_1.HRISAccessRight.delete] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.userinvitation}-${common_model_1.APIMethod.get}`.toLowerCase(), { module: common_model_1.HRISModule.none, rightneed: [] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.userinvitation}-${common_model_1.APIMethod.put}`.toLowerCase(), { module: common_model_1.HRISModule.none, rightneed: [] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.userinvitation}-${common_model_1.APIMethod.post}`.toLowerCase(), { module: common_model_1.HRISModule.none, rightneed: [common_model_1.HRISAccessRight.read] });
//Role
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.role}-${common_model_1.APIMethod.get}`.toLowerCase(), { module: common_model_1.HRISModule.none, rightneed: [common_model_1.HRISAccessRight.read] });
// Role is for support purpose and there is no separated module for maintenance.  So every login user can get
//User Info
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.userinfo}-${common_model_1.APIMethod.get}`.toLowerCase(), { module: common_model_1.HRISModule.none, rightneed: [common_model_1.HRISAccessRight.read] });
//Location
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.location}-${common_model_1.APIMethod.get}`.toLowerCase(), { module: common_model_1.HRISModule.location, rightneed: [common_model_1.HRISAccessRight.read] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.location}-${common_model_1.APIMethod.post}`.toLowerCase(), { module: common_model_1.HRISModule.location, rightneed: [common_model_1.HRISAccessRight.create] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.location}-${common_model_1.APIMethod.delete}`.toLowerCase(), { module: common_model_1.HRISModule.location, rightneed: [common_model_1.HRISAccessRight.delete] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.location}-${common_model_1.APIMethod.put}`.toLowerCase(), { module: common_model_1.HRISModule.location, rightneed: [common_model_1.HRISAccessRight.update] });
//Operation Event
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.opevent}-${common_model_1.APIMethod.get}`.toLowerCase(), { module: common_model_1.HRISModule.eventviewer, rightneed: [common_model_1.HRISAccessRight.read] });
//Upload
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.upload}-${common_model_1.APIMethod.post}`.toLowerCase(), { module: common_model_1.HRISModule.none, rightneed: [] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.upload}-${common_model_1.APIMethod.get}`.toLowerCase(), { module: common_model_1.HRISModule.none, rightneed: [] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.upload}-${common_model_1.APIMethod.delete}`.toLowerCase(), { module: common_model_1.HRISModule.none, rightneed: [common_model_1.HRISAccessRight.read] });
//#region Company
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.company}-${common_model_1.APIMethod.get}`.toLowerCase(), { module: common_model_1.HRISModule.company, rightneed: [] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.company}-${common_model_1.APIMethod.put}`.toLowerCase(), { module: common_model_1.HRISModule.company, rightneed: [common_model_1.HRISAccessRight.update] });
//#endregion
//#region Department
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.department}-${common_model_1.APIMethod.get}`.toLowerCase(), { module: common_model_1.HRISModule.location, rightneed: [common_model_1.HRISAccessRight.read] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.department}-${common_model_1.APIMethod.post}`.toLowerCase(), { module: common_model_1.HRISModule.location, rightneed: [common_model_1.HRISAccessRight.create] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.department}-${common_model_1.APIMethod.delete}`.toLowerCase(), { module: common_model_1.HRISModule.location, rightneed: [common_model_1.HRISAccessRight.delete] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.department}-${common_model_1.APIMethod.put}`.toLowerCase(), { module: common_model_1.HRISModule.location, rightneed: [common_model_1.HRISAccessRight.update] });
//#endregion
//#region MasterItem
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.masteritem}-${common_model_1.APIMethod.get}`.toLowerCase(), { module: common_model_1.HRISModule.masteritem, rightneed: [common_model_1.HRISAccessRight.read] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.masteritem}-${common_model_1.APIMethod.post}`.toLowerCase(), { module: common_model_1.HRISModule.masteritem, rightneed: [common_model_1.HRISAccessRight.create] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.masteritem}-${common_model_1.APIMethod.delete}`.toLowerCase(), { module: common_model_1.HRISModule.masteritem, rightneed: [common_model_1.HRISAccessRight.delete] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.masteritem}-${common_model_1.APIMethod.put}`.toLowerCase(), { module: common_model_1.HRISModule.masteritem, rightneed: [common_model_1.HRISAccessRight.update] });
//#endregion
//#region Staff
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.staff}-${common_model_1.APIMethod.get}`.toLowerCase(), { module: common_model_1.HRISModule.staff, rightneed: [common_model_1.HRISAccessRight.read] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.staff}-${common_model_1.APIMethod.post}`.toLowerCase(), { module: common_model_1.HRISModule.staff, rightneed: [common_model_1.HRISAccessRight.create] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.staff}-${common_model_1.APIMethod.put}`.toLowerCase(), { module: common_model_1.HRISModule.staff, rightneed: [common_model_1.HRISAccessRight.update] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.staff}-${common_model_1.APIMethod.delete}`.toLowerCase(), { module: common_model_1.HRISModule.staff, rightneed: [common_model_1.HRISAccessRight.delete] });
//#endregion
//#region Alert 
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.alertrules}-${common_model_1.APIMethod.get}`.toLowerCase(), { module: common_model_1.HRISModule.staff, rightneed: [common_model_1.HRISAccessRight.read] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.alertrules}-${common_model_1.APIMethod.post}`.toLowerCase(), { module: common_model_1.HRISModule.staff, rightneed: [common_model_1.HRISAccessRight.create] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.alertrules}-${common_model_1.APIMethod.put}`.toLowerCase(), { module: common_model_1.HRISModule.staff, rightneed: [common_model_1.HRISAccessRight.update] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.alertrules}-${common_model_1.APIMethod.delete}`.toLowerCase(), { module: common_model_1.HRISModule.staff, rightneed: [common_model_1.HRISAccessRight.delete] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.alertitems}-${common_model_1.APIMethod.get}`.toLowerCase(), { module: common_model_1.HRISModule.staff, rightneed: [common_model_1.HRISAccessRight.read] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.alertitems}-${common_model_1.APIMethod.delete}`.toLowerCase(), { module: common_model_1.HRISModule.staff, rightneed: [common_model_1.HRISAccessRight.delete] });
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.alertitems}-${common_model_1.APIMethod.put}`.toLowerCase(), { module: common_model_1.HRISModule.staff, rightneed: [common_model_1.HRISAccessRight.update] });
//#endregion
//Staff import and export
rightNeeds.set(`${common_model_1.APIVer.V1}-${common_model_1.APIEndPoint.staffio}-${common_model_1.APIMethod.post}`.toLowerCase(), { module: common_model_1.HRISModule.staff, rightneed: [common_model_1.HRISAccessRight.read] });
const GetTokenAccessRight = (token, module) => {
    var _a;
    if (token.access) {
        for (let i = 0; i < ((_a = token.access) === null || _a === void 0 ? void 0 : _a.length); i++) {
            let item = token.access[i];
            if (item.module === module) {
                return item;
            }
        }
    }
    return undefined;
};
const haveRight = (granted, required) => {
    let retValue = false;
    for (let right of required) {
        if (granted.search(right) >= 0) {
            retValue = true;
            break;
        }
    }
    return retValue;
};
const AuthVerifier = (req, res, next) => {
    const authorization = req.headers['authorization'];
    const version = req.path.split('/')[2];
    const element = req.path.split('/')[3];
    const method = req.method;
    const resourceKey = `${version}-${element}-${method}`;
    let anyError = undefined;
    // console.log(resourceKey);
    const rightNeed = rightNeeds.get(resourceKey.toLowerCase());
    if (rightNeed) //Load the access control entry OK
     {
        //if the target api need not authorization        
        if (rightNeed.rightneed.length == 0) {
            res.locals.accessScope = common_model_1.HRISAccessScope.all;
            anyError = undefined;
        }
        else {
            if (authorization) {
                try {
                    const token = authorization.split(' ')[1];
                    // console.info("authorization: " + authorization);
                    // console.info("token: " + token);
                    const payload = user_model_1.VerifyAccessToken(token);
                    if (rightNeed.module === common_model_1.HRISModule.none) { //If module is none, can access whenever the user is login
                        res.locals.userId = payload.userId;
                        res.locals.accessScope = common_model_1.HRISAccessScope.all;
                        anyError = undefined;
                    }
                    else {
                        let tokenAccess = GetTokenAccessRight(payload, rightNeed.module);
                        if (tokenAccess) {
                            if (haveRight(tokenAccess.right, rightNeed.rightneed)) {
                                res.locals.userId = payload.userId;
                                res.locals.accessScope = tokenAccess.scope;
                                anyError = undefined;
                            }
                            else {
                                anyError = errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.FORBIDDEN, "Assigned right not enough", moduleName);
                            }
                        }
                        else { //No right assigned to the user for this module
                            anyError = errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.FORBIDDEN, "No right assigned", moduleName);
                        }
                    }
                }
                catch (error) { //Any error in checking the token, e.g. invalid token, expired token, etc.
                    anyError = errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.UNAUTHORIZED, error.message, moduleName);
                }
            }
            else { //No token attached in the header
                anyError = errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.UNAUTHORIZED, "No token in header", moduleName);
            }
        }
    }
    else { //if cannot find the corresponding access control table entry, stop the processing, even if the corresponding route implemented
        anyError = errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.NOT_FOUND, "No access control info", moduleName);
    }
    // console.log("anyError: " + anyError);
    next(anyError);
    // if(anyError){
    //     next(anyError);
    // }else{
    //     next();
    // }
};
exports.AuthVerifier = AuthVerifier;
//# sourceMappingURL=authverifier.js.map