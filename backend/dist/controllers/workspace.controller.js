"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceController = void 0;
var workspace_1 = __importDefault(require("../models/workspace"));
var user_1 = __importDefault(require("../models/user"));
var reservation_1 = __importStar(require("../models/reservation"));
var workspace_reaction_1 = __importDefault(require("../models/workspace_reaction"));
var comment_1 = __importDefault(require("../models/comment"));
var WorkspaceController = /** @class */ (function () {
    function WorkspaceController() {
        var _this = this;
        this.addWorkspaceJSON = function (req, res) {
            if (req.body._id == "")
                delete req.body._id;
            var workspace = req.body;
            var company = workspace.company;
            if (!workspace || !company) {
                return res.status(400).json({ message: "Company and workspace are required" });
            }
            var officeNames = workspace.offices.map(function (o) { return o.name; });
            var uniqueOfficeNames = new Set(officeNames);
            if (uniqueOfficeNames.size !== officeNames.length) {
                return res.status(400).json({ message: "Office names must be unique within the workspace" });
            }
            var confNames = workspace.confRooms.map(function (c) { return c.name; });
            var uniqueConfNames = new Set(confNames);
            if (uniqueConfNames.size !== confNames.length) {
                return res.status(400).json({ message: "Conference room must be unique within the workspace" });
            }
            workspace.manager = workspace.manager.username;
            if (workspace.company._id)
                workspace.company = workspace.company._id;
            var newWorkspace = new workspace_1.default(workspace);
            newWorkspace.save().then(function (ok) {
                return res.status(200).json({ message: "Request sent! Waiting for admin approval." });
            }).catch(function (err) {
                console.log(err);
                return res.status(500).json({ message: "Server error" });
            });
        };
        this.addNewWorkspace = function (req, res) {
            var workspaceData = JSON.parse(req.body.workspace);
            if (!workspaceData)
                return res.status(400).json({ message: "Workspace data missing" });
            if (req.files && Array.isArray(req.files) && req.files.length > 0) {
                workspaceData.photos = req.files.map(function (f) { return "/uploads/workspaces/".concat(f.filename); });
            }
            if (workspaceData._id == "")
                delete workspaceData._id;
            var workspace = workspaceData;
            var company = workspace.company;
            if (!workspace || !company) {
                return res.status(400).json({ message: "Company and workspace are required" });
            }
            // office names must be unique (in the same workspace)
            var officeNames = workspace.offices.map(function (o) { return o.name; });
            var uniqueOfficeNames = new Set(officeNames);
            if (uniqueOfficeNames.size !== officeNames.length) {
                return res.status(400).json({ message: "Office names must be unique within the workspace" });
            }
            // conference room names must be unique (in the same workspace)
            var confNames = workspace.confRooms.map(function (c) { return c.name; });
            var uniqueConfNames = new Set(confNames);
            if (uniqueConfNames.size !== confNames.length) {
                return res.status(400).json({ message: "Conference room must be unique within the workspace" });
            }
            // waiting for admin approval
            workspace.manager = workspace.manager.username;
            if (workspace.company._id)
                workspace.company = workspace.company._id;
            var newWorkspace = new workspace_1.default(workspace);
            newWorkspace.save().then(function (ok) {
                return res.status(200).json({ message: "Request sent! Waiting for admin approval." });
            }).catch(function (err) {
                console.log(err);
                return res.status(500).json({ message: "Server error" });
            });
        };
        this.updateWorkspace = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var workspaceID, workspaceData, workspace, newPhotos, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        workspaceID = req.body.workspaceID;
                        workspaceData = typeof req.body.workspace === "string"
                            ? JSON.parse(req.body.workspace)
                            : req.body.workspace;
                        return [4 /*yield*/, workspace_1.default.findById(workspaceID)];
                    case 1:
                        workspace = _a.sent();
                        if (!workspace) {
                            return [2 /*return*/, res.status(404).json({ message: "Workspace not found" })];
                        }
                        workspace.workspaceName = workspaceData.workspaceName;
                        workspace.city = workspaceData.city;
                        workspace.address = workspaceData.address;
                        workspace.pricePerHour = workspaceData.pricePerHour;
                        workspace.penaltyPoints = workspaceData.penaltyPoints;
                        workspace.description = workspaceData.description;
                        workspace.openSpace = workspaceData.openSpace;
                        workspace.offices = workspaceData.offices;
                        workspace.confRooms = workspaceData.confRooms;
                        if (req.files && Array.isArray(req.files)) {
                            newPhotos = req.files.map(function (f) { return "/uploads/workspaces/".concat(f.filename); });
                            if (workspace.photos) {
                                workspace.photos = __spreadArray(__spreadArray([], workspace.photos, true), newPhotos, true);
                            }
                            else {
                                workspace.photos = newPhotos;
                            }
                        }
                        return [4 /*yield*/, workspace.save()];
                    case 2:
                        _a.sent();
                        res.json({ message: "Workspace updated successfully" });
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.log(err_1);
                        res.status(500).json({ message: "Error updating workspace" });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.deleteWorkspacePhoto = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, workspaceID, photo_1, workspace, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, workspaceID = _a.workspaceID, photo_1 = _a.photo;
                        return [4 /*yield*/, workspace_1.default.findById(workspaceID)];
                    case 1:
                        workspace = _b.sent();
                        if (!workspace)
                            return [2 /*return*/, res.status(404).json({ message: "Workspace not found" })];
                        // Filter out the photo
                        workspace.photos = workspace.photos.filter(function (p) { return p !== photo_1; });
                        return [4 /*yield*/, workspace.save()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({ message: "Photo removed", photos: workspace.photos })];
                    case 3:
                        err_2 = _b.sent();
                        console.log(err_2);
                        return [2 /*return*/, res.status(500).json({ message: "Error removing photo" })];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.getPendingWorkspaces = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var ws, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, workspace_1.default.find({ approved: false })];
                    case 1:
                        ws = _a.sent();
                        return [2 /*return*/, res.status(200).json(ws)];
                    case 2:
                        err_3 = _a.sent();
                        console.log(err_3);
                        return [2 /*return*/, res.status(500).json(null)];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.acceptWorkspace = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var workspace, ws, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        workspace = req.body;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, workspace_1.default.findByIdAndUpdate(workspace._id, { approved: true })];
                    case 2:
                        ws = _a.sent();
                        return [2 /*return*/, res.status(200).json({ message: "Workspace accepted!" })];
                    case 3:
                        err_4 = _a.sent();
                        console.log(err_4);
                        return [2 /*return*/, res.status(500).json(null)];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.rejectWorkspace = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var workspace, ws, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        workspace = req.body;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, workspace_1.default.findByIdAndDelete(workspace._id)];
                    case 2:
                        ws = _a.sent();
                        return [2 /*return*/, res.status(200).json({ message: "Workspace registracion request rejected!" })];
                    case 3:
                        err_5 = _a.sent();
                        console.log(err_5);
                        return [2 /*return*/, res.status(500).json(null)];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.searchGuest = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, name, cities, match, workspaces, err_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, name = _a.name, cities = _a.cities;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        match = {};
                        // filter by workspace name
                        if (name && name.trim() !== "") {
                            match["workspaceName"] = { $regex: name, $options: "i" };
                        }
                        // filter by city
                        if (cities && cities.length > 0) {
                            match["city"] = { $in: cities };
                        }
                        match["approved"] = true;
                        return [4 /*yield*/, workspace_1.default.find(match)];
                    case 2:
                        workspaces = _b.sent();
                        return [2 /*return*/, res.status(200).json(workspaces)];
                    case 3:
                        err_6 = _b.sent();
                        console.log(err_6);
                        return [2 /*return*/, res.status(500).json({ message: "Server error" })];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.searchMember = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, name, cities, selectedType, officeCapacity, match, workspaces, err_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, name = _a.name, cities = _a.cities, selectedType = _a.selectedType, officeCapacity = _a.officeCapacity;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        match = {};
                        // filter by workspace name
                        if (name && name.trim() !== "") {
                            match["workspaceName"] = { $regex: name, $options: "i" };
                        }
                        // filter by city
                        if (cities && cities.length > 0) {
                            match["city"] = { $in: cities };
                        }
                        // filter by type
                        if (selectedType === "office") {
                            match["offices"] = {
                                $elemMatch: __assign({}, (officeCapacity ? { desks: { $gte: officeCapacity } } : {}))
                            };
                        }
                        if (selectedType === "conf") {
                            match["confRooms.0"] = { $exists: true };
                        }
                        match["approved"] = true;
                        return [4 /*yield*/, workspace_1.default.find(match)];
                    case 2:
                        workspaces = _b.sent();
                        return [2 /*return*/, res.status(200).json(workspaces)];
                    case 3:
                        err_7 = _b.sent();
                        console.log(err_7);
                        return [2 /*return*/, res.status(500).json({ message: "Server error" })];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.getCities = function (req, res) {
            workspace_1.default.distinct('city').then(function (cities) {
                return res.status(200).json(cities);
            }).catch(function (err) {
                console.log(err);
                return res.status(500).json(null);
            });
        };
        this.getWorkspaceDetails = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var workspaceID, workspace, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        workspaceID = req.body.workspaceID;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, workspace_1.default.findById(workspaceID).populate('company')];
                    case 2:
                        workspace = _a.sent();
                        return [2 /*return*/, res.status(200).json(workspace)];
                    case 3:
                        err_8 = _a.sent();
                        console.log(err_8);
                        return [2 /*return*/, res.status(500).json(null)];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.userCanLike = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, workspaceID, username, user, completedReservationsCnt, reactionsCnt, err_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        _a = req.body, workspaceID = _a.workspaceID, username = _a.username;
                        return [4 /*yield*/, user_1.default.findOne({ username: username })];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            return [2 /*return*/, res.status(400).json({ message: "User not found" })];
                        }
                        return [4 /*yield*/, reservation_1.default.countDocuments({
                                workspace: workspaceID,
                                user: user._id,
                                status: reservation_1.ReservationStatus.COMPLETED
                            })
                            // count reactions
                        ];
                    case 2:
                        completedReservationsCnt = _b.sent();
                        return [4 /*yield*/, workspace_reaction_1.default.countDocuments({
                                workspace: workspaceID,
                                user: user._id
                            })];
                    case 3:
                        reactionsCnt = _b.sent();
                        if (reactionsCnt >= completedReservationsCnt) {
                            return [2 /*return*/, res.status(200).json(false)];
                        }
                        return [2 /*return*/, res.status(200).json(true)];
                    case 4:
                        err_9 = _b.sent();
                        console.log(err_9);
                        return [2 /*return*/, res.status(500).json({ message: "Server error" })];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.userCanComment = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, workspaceID, username, user, completedReservationsCnt, commentsCnt, err_10;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        _a = req.body, workspaceID = _a.workspaceID, username = _a.username;
                        return [4 /*yield*/, user_1.default.findOne({ username: username })];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            return [2 /*return*/, res.status(400).json({ message: "User not found" })];
                        }
                        return [4 /*yield*/, reservation_1.default.countDocuments({
                                workspace: workspaceID,
                                user: user._id,
                                status: reservation_1.ReservationStatus.COMPLETED
                            })
                            // count comments
                        ];
                    case 2:
                        completedReservationsCnt = _b.sent();
                        return [4 /*yield*/, comment_1.default.countDocuments({
                                workspace: workspaceID,
                                user: user._id
                            })];
                    case 3:
                        commentsCnt = _b.sent();
                        if (commentsCnt >= completedReservationsCnt) {
                            return [2 /*return*/, res.status(200).json(false)];
                        }
                        return [2 /*return*/, res.status(200).json(true)];
                    case 4:
                        err_10 = _b.sent();
                        console.log(err_10);
                        return [2 /*return*/, res.status(500).json({ message: "Server error" })];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.react = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, workspace, user, type, userInfo, workspaceInfo, completedReservationsCnt, reactionsCnt, newReaction, err_11;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 10, , 11]);
                        _a = req.body, workspace = _a.workspace, user = _a.user, type = _a.type;
                        return [4 /*yield*/, user_1.default.findById(user)];
                    case 1:
                        userInfo = _b.sent();
                        if (!userInfo) {
                            return [2 /*return*/, res.status(400).json({ message: "User not found" })];
                        }
                        return [4 /*yield*/, workspace_1.default.findById(workspace)];
                    case 2:
                        workspaceInfo = _b.sent();
                        if (!workspaceInfo) {
                            return [2 /*return*/, res.status(400).json({ message: "Workspace not found" })];
                        }
                        return [4 /*yield*/, reservation_1.default.countDocuments({
                                workspace: workspace,
                                user: user,
                                status: reservation_1.ReservationStatus.COMPLETED
                            })];
                    case 3:
                        completedReservationsCnt = _b.sent();
                        return [4 /*yield*/, workspace_reaction_1.default.countDocuments({
                                workspace: workspace,
                                user: user
                            })];
                    case 4:
                        reactionsCnt = _b.sent();
                        if (reactionsCnt >= completedReservationsCnt) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "You cannot react more times than completed reservations"
                                })];
                        }
                        newReaction = new workspace_reaction_1.default({
                            workspace: workspace,
                            user: user,
                            type: type
                        });
                        if (!(type === "like")) return [3 /*break*/, 6];
                        return [4 /*yield*/, workspace_1.default.updateOne({ _id: workspace }, { $inc: { likesCount: 1 } })];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, workspace_1.default.updateOne({ _id: workspace }, { $inc: { dislikeCount: 1 } })];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [4 /*yield*/, newReaction.save()];
                    case 9:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({ message: "Reaction added" })];
                    case 10:
                        err_11 = _b.sent();
                        console.log(err_11);
                        return [2 /*return*/, res.status(500).json({ message: "Server error" })];
                    case 11: return [2 /*return*/];
                }
            });
        }); };
        this.leaveComment = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, workspace, user, text, createdAt, userInfo, workspaceInfo, completedReservationsCnt, commentsCnt, newComment, err_12;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        _a = req.body, workspace = _a.workspace, user = _a.user, text = _a.text, createdAt = _a.createdAt;
                        return [4 /*yield*/, user_1.default.findById(user)];
                    case 1:
                        userInfo = _b.sent();
                        if (!userInfo) {
                            return [2 /*return*/, res.status(400).json({ message: "User not found" })];
                        }
                        return [4 /*yield*/, workspace_1.default.findById(workspace)];
                    case 2:
                        workspaceInfo = _b.sent();
                        if (!workspaceInfo) {
                            return [2 /*return*/, res.status(400).json({ message: "Workspace not found" })];
                        }
                        return [4 /*yield*/, reservation_1.default.countDocuments({
                                workspace: workspace,
                                user: user,
                                status: reservation_1.ReservationStatus.COMPLETED
                            })];
                    case 3:
                        completedReservationsCnt = _b.sent();
                        return [4 /*yield*/, comment_1.default.countDocuments({
                                workspace: workspace,
                                user: user
                            })];
                    case 4:
                        commentsCnt = _b.sent();
                        if (commentsCnt >= completedReservationsCnt) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "You cannot react more times than completed reservations"
                                })];
                        }
                        newComment = new comment_1.default({
                            workspace: workspace,
                            user: user,
                            text: text,
                            createdAt: createdAt
                        });
                        return [4 /*yield*/, workspace_1.default.updateOne({ _id: workspace }, { $inc: { commentsCount: 1 } })];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, newComment.save()];
                    case 6:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({ message: "Comment added" })];
                    case 7:
                        err_12 = _b.sent();
                        console.log(err_12);
                        return [2 /*return*/, res.status(500).json({ message: "Server error" })];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        this.getLastComments = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var workspaceID, comments, err_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        workspaceID = req.body.workspaceID;
                        return [4 /*yield*/, comment_1.default.find({ workspace: workspaceID }).sort({ createdAt: -1 }).limit(10)
                                .populate("user")];
                    case 1:
                        comments = _a.sent();
                        return [2 /*return*/, res.status(200).json(comments)];
                    case 2:
                        err_13 = _a.sent();
                        console.log(err_13);
                        return [2 /*return*/, res.status(500).json({ message: "Server error" })];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.top5Workspaces = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var top5Workspaces, err_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, workspace_1.default.find({ approved: true }).sort({ likesCount: -1 }).
                                limit(5).select("workspaceName city address likesCount")];
                    case 1:
                        top5Workspaces = _a.sent();
                        return [2 /*return*/, res.status(200).json(top5Workspaces)];
                    case 2:
                        err_14 = _a.sent();
                        console.log(err_14);
                        return [2 /*return*/, res.status(500).json({ message: "Server error" })];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.totalWorkspaceCount = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var total, err_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, workspace_1.default.countDocuments({ approved: true })];
                    case 1:
                        total = _a.sent();
                        return [2 /*return*/, res.status(200).json(total)];
                    case 2:
                        err_15 = _a.sent();
                        console.log(err_15);
                        return [2 /*return*/, res.status(500).json({ message: "Server error" })];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.getManagedWorkspaces = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var manager, ws, err_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        manager = req.body.manager;
                        return [4 /*yield*/, workspace_1.default.find({ manager: manager }).populate('company')];
                    case 1:
                        ws = _a.sent();
                        return [2 /*return*/, res.status(200).json(ws)];
                    case 2:
                        err_16 = _a.sent();
                        console.log(err_16);
                        return [2 /*return*/, res.status(500).json({ message: "Server error" })];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.getAllWorkspaces = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var ws, err_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, workspace_1.default.find()];
                    case 1:
                        ws = _a.sent();
                        return [2 /*return*/, res.status(200).json(ws)];
                    case 2:
                        err_17 = _a.sent();
                        console.log(err_17);
                        return [2 /*return*/, res.status(500).json({ message: "Server error" })];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
    }
    return WorkspaceController;
}());
exports.WorkspaceController = WorkspaceController;
