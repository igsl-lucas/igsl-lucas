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
const uploadFileSchema = new mongoose_1.Schema({
    originalname: { type: String, required: true },
    encoding: { type: String },
    mimetype: { type: String },
    content: { type: Buffer },
    lastmodified: { type: Date },
    desc: { type: String },
    tags: [{ type: String }],
    isvalid: { type: Boolean },
    template: { type: Number },
});
;
exports.Uploadfile = mongoose_1.default.model('UploadFile', uploadFileSchema);
//# sourceMappingURL=uploadfile.model.js.map