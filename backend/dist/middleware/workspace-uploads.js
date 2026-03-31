"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadWorkspacePhotos = void 0;
var multer_1 = __importDefault(require("multer"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var dir = 'uploads/workspaces';
if (!fs_1.default.existsSync(dir)) {
    fs_1.default.mkdirSync(dir, { recursive: true });
}
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        try {
            var workspaceName = 'workspace';
            if (req.body.workspace) {
                try {
                    var workspaceData = JSON.parse(req.body.workspace);
                    if (workspaceData && workspaceData.workspaceName) {
                        workspaceName = workspaceData.workspaceName;
                    }
                }
                catch (e) {
                    console.log('Could not parse workspace data for filename');
                }
            }
            var timestamp = Date.now();
            var ext = path_1.default.extname(file.originalname);
            // replace spaces with _
            var safeWorkspaceName = workspaceName.replace(/\s+/g, '_');
            cb(null, "".concat(safeWorkspaceName, "-").concat(timestamp).concat(ext));
        }
        catch (err) {
            cb(null, "".concat(Date.now()).concat(path_1.default.extname(file.originalname)));
        }
    }
});
var uploadWorkspacePhotos = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});
exports.uploadWorkspacePhotos = uploadWorkspacePhotos;
