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
const accessSchema = new mongoose_1.Schema({
    module: { type: String, required: true },
    right: { type: String, required: true },
    scope: { type: String, required: true }
});
const roleSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String },
    issuper: { type: Boolean, required: true },
    access: [{ type: accessSchema }]
});
;
;
exports.Role = mongoose_1.default.model('Role', roleSchema);
//# sourceMappingURL=role.model.js.map