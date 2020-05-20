"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.AuditSchema = new mongoose_1.Schema({
    createOn: { type: Date, required: true },
    createBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    updateOn: { type: Date, required: true },
    updateBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
});
//# sourceMappingURL=common.model.js.map