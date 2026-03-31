"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var officeSchema = new mongoose_1.default.Schema({
    name: String,
    desks: Number
    // approved: Boolean
}, { _id: false });
var confRoomSchema = new mongoose_1.default.Schema({
    name: String,
    equipment: String
    // approved: Boolean
}, { _id: false });
var openSpaceSchema = new mongoose_1.default.Schema({
    name: String,
    desks: Number
}, { _id: false });
var workspaceSchema = new mongoose_1.default.Schema({
    company: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Company', required: true },
    workspaceName: String,
    pricePerHour: Number,
    // desksOpenSpace: Number,
    city: String,
    address: String,
    openSpace: openSpaceSchema,
    offices: [officeSchema],
    confRooms: [confRoomSchema],
    manager: String,
    approved: Boolean,
    penaltyPoints: Number,
    likesCount: Number,
    dislikeCount: Number,
    commentsCount: Number,
    photos: [String],
    description: String
}, { versionKey: false });
exports.default = mongoose_1.default.model("Workspace", workspaceSchema, "workspaces");
