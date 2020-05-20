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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const role_model_1 = require("./role.model");
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = require("dotenv");
const common_model_1 = require("./common.model");
dotenv_1.config();
const accessKey = process.env.ACCESS_TOKEN_KEY || '284ac073a51c9b29ddad20b59f78f7375fb3b18c635b33b50000967ef22db121';
const refreshKey = process.env.REFRESH_TOKEN_KEY || '90b7a1370d49a9adab27e49e43c92a1bf094c2d07aebe093faec3b96247130ee';
const accessKeyExpireIn = process.env.ACCESS_TOKEN_EXPIRE_IN || "15m";
const refreshKeyExpireIn = process.env.REFRESH_TOKEN_EXPIRE_IN || "1d";
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: mongoose_1.Schema.Types.ObjectId, ref: "Role", required: true },
    portrait: { type: String },
    refreshtokenversion: { type: Number, required: true },
    staff: { type: mongoose_1.Schema.Types.ObjectId, ref: "Staff" },
    status: { type: Boolean, default: true },
    audit: { type: common_model_1.AuditSchema },
});
const VerifyAccessToken = (token) => {
    try {
        const payload = jsonwebtoken_1.verify(token, accessKey);
        if (!payload) { //This case should not happen
            throw (new Error("Cannot verify token"));
        }
        return payload;
    }
    catch (error) {
        throw (error);
    }
};
exports.VerifyAccessToken = VerifyAccessToken;
const VerifyRefreshToken = (token) => {
    try {
        const payload = jsonwebtoken_1.verify(token, refreshKey);
        if (!payload) { //This case should not happen
            throw (new Error("Cannot verify token"));
        }
        return payload;
    }
    catch (error) {
        throw (error);
    }
};
exports.VerifyRefreshToken = VerifyRefreshToken;
const GetAccessToken = (userId, roleId) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const role = yield role_model_1.Role.findById(roleId);
            if (role != null) {
                const payload = {
                    userId: userId,
                    access: role.access
                };
                const signedToken = jsonwebtoken_1.sign(payload, accessKey, {
                    expiresIn: accessKeyExpireIn
                });
                resolve(signedToken);
            }
            else {
                reject("No access info");
            }
        }
        catch (error) {
            reject("Error generating Access Token");
        }
    }));
});
exports.GetAccessToken = GetAccessToken;
const GetRefreshToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User.findById(userId);
            if (user != null) {
                const payload = {
                    userId: userId,
                    version: user.refreshtokenversion
                };
                const signedToken = jsonwebtoken_1.sign(payload, refreshKey, {
                    expiresIn: refreshKeyExpireIn
                });
                resolve(signedToken);
            }
            else {
                reject("No user info");
            }
        }
        catch (error) {
            reject("Error generating refresh token");
        }
    }));
});
exports.GetRefreshToken = GetRefreshToken;
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
//# sourceMappingURL=user.model.js.map