"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadUserPhotos = void 0;
var multer_1 = __importDefault(require("multer"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
// make folder if does not exist
var dir = 'uploads/profiles';
if (!fs_1.default.existsSync(dir)) {
    fs_1.default.mkdirSync(dir, { recursive: true });
}
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        try {
            var username = "";
            if (req.body.user) { // registration
                var user = JSON.parse(req.body.user);
                username = user.username;
            }
            else if (req.body.username) { // profile image updating
                username = req.body.username;
            }
            var ext = path_1.default.extname(file.originalname);
            cb(null, "".concat(username).concat(ext));
        }
        catch (error) {
            var ext = path_1.default.extname(file.originalname);
            cb(null, "".concat(Date.now()).concat(ext));
        }
    }
});
var uploadUserPhotos = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 500 * 1024 } // 500KB
});
exports.uploadUserPhotos = uploadUserPhotos;
