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
const ConditionSchema = new mongoose_1.Schema({
    periodfr: { type: Number },
    periodto: { type: Number },
    type: { type: String },
    repeatat: { type: Number },
    repeatfreq: { type: String },
    repeattype: { type: String },
    overat: { type: Number },
    overfreq: { type: String },
    outstanding: { type: Boolean },
    allstaff: { type: Boolean },
    alldept: { type: Boolean },
    applystaff: { type: Object },
    apply_dept: { type: Object },
});
const MessageSchema = new mongoose_1.Schema({
    alertuser: { type: Array },
    alertdept: { type: Array },
    alluser: { type: Boolean },
    alldept: { type: Boolean },
    subject: { type: String },
    content: { type: String },
    alertmth: { type: String },
});
const AlertRulesSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String },
    enable: { type: Boolean },
    condition: { type: ConditionSchema },
    message: { type: MessageSchema },
});
;
exports.AlertRules = mongoose_1.default.model('alertrules', AlertRulesSchema);
const AlertToSchema = new mongoose_1.Schema({
    alerttype: { type: String, required: true },
    alerttoid: { type: mongoose_1.Schema.Types.ObjectId, required: true },
});
const CommentSchema = new mongoose_1.Schema({
    uid: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    date: { type: Number },
    content: { type: String }
});
const AlertItemsSchema = new mongoose_1.Schema({
    aid: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    name: { type: String },
    date: { type: Number, required: true },
    outdate: { type: Number },
    subject: { type: String },
    content: { type: String },
    alertTo: { type: AlertToSchema },
    applyTo: { type: mongoose_1.Schema.Types.ObjectId, ref: "Staff" },
    status: { type: String },
    comment: [{ type: CommentSchema }],
    alertmth: { type: String },
});
;
exports.AlertItems = mongoose_1.default.model('alertitems', AlertItemsSchema);
//# sourceMappingURL=alertrules.model.js.map