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
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = require("dotenv");
const fs_1 = __importDefault(require("fs"));
const uploadfile_model_1 = require("../models/uploadfile.model");
const errorhandler_1 = require("../utils/errorhandler");
const common_model_1 = require("../common/common.model");
const router = express_1.Router();
exports.UploadRoute = router;
const moduleName = "API - Upload";
dotenv_1.config();
const uploadPath = process.env.UPLOAD_TEMP_PATH || '';
const upload = multer_1.default({ dest: uploadPath });
router.post('/', upload.single('file-upload'), (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let uploadFile = new uploadfile_model_1.Uploadfile();
        uploadFile.originalname = req.file.originalname;
        uploadFile.encoding = req.file.encoding;
        uploadFile.mimetype = req.file.mimetype;
        uploadFile.content = new Buffer(fs_1.default.readFileSync(req.file.path));
        uploadFile.isvalid = false;
        // uploadFile.desc = req.body.desc;
        // uploadFile.lastmodified = req.body.lastmodified;
        // uploadFile.tags = req.body.tags?.slice();
        fs_1.default.unlinkSync(req.file.path);
        yield uploadFile.save();
        resp.status(errorhandler_1.HTTPStatus.OK).json({ "_id": uploadFile._id });
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.post('/:id', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let uploadFile = yield uploadfile_model_1.Uploadfile.findById(req.params.id);
        let inUploadFile = req.body;
        if (uploadFile) {
            uploadFile.lastmodified = inUploadFile.lastmodified;
            uploadFile.desc = inUploadFile.desc;
            uploadFile.tags = inUploadFile.tags;
            uploadFile.isvalid = inUploadFile.isvalid;
            yield uploadFile.save();
            resp.status(errorhandler_1.HTTPStatus.OK).json({ "_id": req.params.id });
        }
        else {
            next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.NOT_FOUND, undefined, moduleName));
        }
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
router.delete('/:id', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield uploadfile_model_1.Uploadfile.deleteOne({ _id: req.params.id });
        resp.status(errorhandler_1.HTTPStatus.NO_CONTENT).json({ message: "OK" });
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
// router.get('/:id', async (req: Request, resp: Response, next: NextFunction) => {
//     try {
//         let uploadFile = await Uploadfile.findById(req.params.id)
//         if(uploadFile){
//             resp.writeHead(HTTPStatus.OK, {ContentType:uploadFile.mimetype});
//             resp.end(uploadFile.content);
//         }else{
//             next(CreateErr(HTTPStatus.NOT_FOUND, undefined, moduleName));
//         }
//     } catch (error) {
//         next(CreateErr(HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
//     }
// });
router.get('/:id', (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getFile = (req.query[common_model_1.QueryTag.TagGetFile] === common_model_1.QueryTag.ValueYes);
        const getImage = (req.query[common_model_1.QueryTag.TagGetImage] === common_model_1.QueryTag.ValueYes);
        const fieldSelect = (getFile || getImage) ? "mimetype content" : "-content";
        let uploadFile = yield uploadfile_model_1.Uploadfile.findById(req.params.id).select(fieldSelect);
        if (uploadFile) {
            if (getFile) {
                resp.writeHead(errorhandler_1.HTTPStatus.OK, { ContentType: uploadFile.mimetype });
                resp.end(uploadFile.content);
            }
            else if (getImage) {
                resp.status(errorhandler_1.HTTPStatus.OK).json(`data:${uploadFile.mimetype};base64,${uploadFile.content.toString('base64')}`);
            }
            else {
                resp.status(errorhandler_1.HTTPStatus.OK).json(uploadFile);
            }
        }
        else {
            next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.NOT_FOUND, undefined, moduleName));
        }
    }
    catch (error) {
        next(errorhandler_1.CreateErr(errorhandler_1.HTTPStatus.INTERNAL_SERVER_ERROR, error.message, moduleName));
    }
}));
//# sourceMappingURL=upload.route.js.map