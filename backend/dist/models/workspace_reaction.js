"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionType = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
exports.ReactionType = {
    LIKE: 'like',
    DISLIKE: 'dislike'
};
var workspaceReactionSchema = new mongoose_1.default.Schema({
    workspace: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: Object.values(exports.ReactionType)
    },
}, { versionKey: false });
exports.default = mongoose_1.default.model("WorkspaceReaction", workspaceReactionSchema, "reactions");
