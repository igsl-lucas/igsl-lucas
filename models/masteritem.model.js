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
const MasterItemSchema = new mongoose_1.Schema({
    type: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: Object, required: true },
    status: { type: Boolean },
    visible: { type: Boolean },
    audit: { type: common_model_1.AuditSchema },
}, {
    toJSON: {
        virtuals: true,
    }
});
MasterItemSchema.virtual("desc_code").get(function () {
    let retValue = {
        en: `(${this.code}) ${this.description.en}`,
        tch: `(${this.code}) ${this.description.tch}`,
        sch: `(${this.code}) ${this.description.sch}`,
    };
    return retValue;
});
;
exports.MasterItem = mongoose_1.default.model('masteritems', MasterItemSchema);
//# sourceMappingURL=masteritem.model.js.map