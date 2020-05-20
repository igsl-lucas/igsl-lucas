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
const AttachmentSchema = new mongoose_1.Schema({
    filename: { type: String, required: true },
    content: { type: String, required: true },
    contentType: { type: String },
    encoding: { type: String }
});
const MailItemSchema = new mongoose_1.Schema({
    from: { type: String, required: true },
    to: { type: String },
    cc: { type: String },
    bcc: { type: String },
    subject: { type: String },
    text: { type: String },
    html: { type: String },
    sendafter: { type: Date, required: true },
    sentat: { type: Date },
    retrycount: { type: Number, required: true },
    attachment: [{ type: AttachmentSchema }]
});
;
exports.MailQueueItem = mongoose_1.default.model('MailQueueItem', MailItemSchema);
exports.MailItem = mongoose_1.default.model('MailItem', MailItemSchema);
const MessageTemplateSchema = new mongoose_1.Schema({
    type: { type: String, required: true, unique: true },
    for: { type: String, required: true, unique: true },
    subject: { type: String },
    content: { type: String },
});
;
exports.MessageTemplate = mongoose_1.default.model('messagetemplate', MessageTemplateSchema);
//# sourceMappingURL=mail.model.js.map