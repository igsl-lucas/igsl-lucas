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
const common_model_1 = require("./common.model");
const LocationSchema = new mongoose_1.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    fulladdress: { type: String },
    audit: { type: common_model_1.AuditSchema },
});
;
exports.Location = mongoose_1.default.model('Location', LocationSchema);
//# sourceMappingURL=location.model.js.map