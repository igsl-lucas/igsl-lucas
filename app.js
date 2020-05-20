"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const requestlogger_1 = require("./utils/requestlogger");
const errorhandler_1 = require("./utils/errorhandler");
// import { MyCompanyRoute } from './routes/mycompany.route'; 
const company_route_1 = require("./routes/company.route");
const login_route_1 = require("./routes/login.route");
const userinfo_route_1 = require("./routes/userinfo.route");
const authverifier_1 = require("./utils/authverifier");
const refreshtoken_route_1 = require("./routes/refreshtoken.route");
const changepassword_route_1 = require("./routes/changepassword.route");
const location_route_1 = require("./routes/location.route");
const department_route_1 = require("./routes/department.route");
const masteritem_route_1 = require("./routes/masteritem.route");
const staff_route_1 = require("./routes/staff.route");
const forgotpassword_route_1 = require("./routes/forgotpassword.route");
const resetpassword_route_1 = require("./routes/resetpassword.route");
const userinvitation_route_1 = require("./routes/userinvitation.route");
const opevent_route_1 = require("./routes/opevent.route");
const upload_route_1 = require("./routes/upload.route");
const user_route_1 = require("./routes/user.route");
const staffio_route_1 = require("./routes/staffio.route");
const alertrules_route_1 = require("./routes/alertrules.route");
const alertitems_route_1 = require("./routes/alertitems.route");
const role_route_1 = require("./routes/role.route");
const common_model_1 = require("./common/common.model");
const app = express_1.default();
exports.app = app;
app.use(cors_1.default());
app.use(helmet_1.default());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(requestlogger_1.RequestLogger);
app.use(authverifier_1.AuthVerifier);
let apiPrefix = "/api";
let apiVer;
//Router Info Begin
//V1 Begin
apiVer = `/${common_model_1.APIVer.V1}`;
// app.use(`${apiPrefix}${apiVer}/${APIEndPoint.mycompany}`, MyCompanyRoute);
app.use(`${apiPrefix}${apiVer}/${common_model_1.APIEndPoint.company}`, company_route_1.CompanyRoute);
app.use(`${apiPrefix}${apiVer}/${common_model_1.APIEndPoint.userinfo}`, userinfo_route_1.UserInfoRoute);
app.use(`${apiPrefix}${apiVer}/${common_model_1.APIEndPoint.login}`, login_route_1.LoginRoute);
app.use(`${apiPrefix}${apiVer}/${common_model_1.APIEndPoint.refreshtoken}`, refreshtoken_route_1.RefreshTokenRoute);
app.use(`${apiPrefix}${apiVer}/${common_model_1.APIEndPoint.changepassword}`, changepassword_route_1.ChangePasswordRoute);
app.use(`${apiPrefix}${apiVer}/${common_model_1.APIEndPoint.forgotpassword}`, forgotpassword_route_1.ForgotPasswordRoute);
app.use(`${apiPrefix}${apiVer}/${common_model_1.APIEndPoint.resetpassword}`, resetpassword_route_1.ResetPasswordRoute);
app.use(`${apiPrefix}${apiVer}/${common_model_1.APIEndPoint.userinvitation}`, userinvitation_route_1.UserInvitationRoute);
app.use(`${apiPrefix}${apiVer}/${common_model_1.APIEndPoint.location}`, location_route_1.LocationRoute);
app.use(`${apiPrefix}${apiVer}/${common_model_1.APIEndPoint.department}`, department_route_1.DepartmentRoute);
app.use(`${apiPrefix}${apiVer}/${common_model_1.APIEndPoint.masteritem}`, masteritem_route_1.MasterItemRoute);
app.use(`${apiPrefix}${apiVer}/${common_model_1.APIEndPoint.opevent}`, opevent_route_1.OpEventRoute);
app.use(`${apiPrefix}${apiVer}/${common_model_1.APIEndPoint.staff}`, staff_route_1.StaffRoute);
app.use(`${apiPrefix}${apiVer}/${common_model_1.APIEndPoint.upload}`, upload_route_1.UploadRoute);
app.use(`${apiPrefix}${apiVer}/${common_model_1.APIEndPoint.user}`, user_route_1.UserRoute);
app.use(`${apiPrefix}${apiVer}/${common_model_1.APIEndPoint.staffio}`, staffio_route_1.StaffIORoute);
app.use(`${apiPrefix}${apiVer}/${common_model_1.APIEndPoint.alertrules}`, alertrules_route_1.AlertRulesRoute);
app.use(`${apiPrefix}${apiVer}/${common_model_1.APIEndPoint.alertitems}`, alertitems_route_1.AlertItemsRoute);
app.use(`${apiPrefix}${apiVer}/${common_model_1.APIEndPoint.role}`, role_route_1.RoleRoute);
// app.use(`${apiPrefix}${apiVer}/testerr`, TestErrorRoute);
// app.use(function(req, res, next) {
//     console.info("not found");
//     return res.status(404).send({ message: 'Route'+req.url+' Not found.' });
//   });
//V2 Begin
//Router Info End
//Error Handling
app.use(errorhandler_1.NotFoundHandler);
app.use(errorhandler_1.ErrHandler);
//# sourceMappingURL=app.js.map