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
const userInfoSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: mongoose_1.Schema.Types.ObjectId, ref: "Role" },
    portrait: { type: String }
}, { collection: 'users' });
const UserInfo = mongoose_1.default.model('UserInfo', userInfoSchema);
exports.UserInfo = UserInfo;
//# sourceMappingURL=userinfo.model.js.map