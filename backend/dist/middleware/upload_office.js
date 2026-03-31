"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadOfficePhotos = void 0;
var multer_1 = __importDefault(require("multer"));
var path_1 = __importDefault(require("path"));
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads_offices/');
    },
    filename: function (req, file, cb) {
        try {
            var officeName = req.body.officeName || 'office';
            var ext = path_1.default.extname(file.originalname);
            // ime fajla: officeName + timestamp + .ext
            cb(null, "".concat(officeName).concat(ext));
        }
        catch (error) {
            var ext = path_1.default.extname(file.originalname);
            cb(null, "".concat(ext));
        }
    }
});
// limit za upload (npr. 5MB po slici)
var uploadOfficePhotos = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});
exports.uploadOfficePhotos = uploadOfficePhotos;
