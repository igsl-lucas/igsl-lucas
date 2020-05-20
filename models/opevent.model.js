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
const opEventSchema = new mongoose_1.Schema({
    source: { type: String, required: true },
    level: { type: String, required: true },
    recorddt: { type: Date, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    message: { type: String }
});
;
exports.OpEvent = mongoose_1.default.model('OpEvent', opEventSchema);
//# sourceMappingURL=opevent.model.js.map