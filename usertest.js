"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
const user_model_1 = require("./models/user.model");
const role_model_1 = require("./models/role.model");
dotenv_1.config();
const MONGO_URI = process.env.DATABASE_URL || "";
mongoose_1.default.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose_1.default.connection.on('open', () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.info("DB Connected!!");
    const users = yield user_model_1.User.find();
    const user = users[0];
    const role = yield role_model_1.Role.findById(user === null || user === void 0 ? void 0 : user.role);
    //const role = await (await user.populate('role').execPopulate()).role;
    console.info(user === null || user === void 0 ? void 0 : user.name);
    console.info(role === null || role === void 0 ? void 0 : role.name);
    console.info(role === null || role === void 0 ? void 0 : role.access);
    console.info((_a = role === null || role === void 0 ? void 0 : role.access) === null || _a === void 0 ? void 0 : _a.toString());
    process.exit();
}));
mongoose_1.default.connection.on('error', (err) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(err.message);
}));
//# sourceMappingURL=usertest.js.map