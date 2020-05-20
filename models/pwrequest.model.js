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
const PWRequestSchema = new mongoose_1.Schema({
    uid: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    sid: { type: mongoose_1.Schema.Types.ObjectId, ref: "Staff" },
    type: { type: String, required: true },
    email: { type: String, required: true },
    token: { type: String, required: true },
    create_on: { type: Number },
    status: { type: Boolean },
});
;
exports.PWRequest = mongoose_1.default.model('pwrequest', PWRequestSchema);
//# sourceMappingURL=pwrequest.model.js.map