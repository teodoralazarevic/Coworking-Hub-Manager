"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var userSchema = new mongoose_1.default.Schema({
    username: { type: String, unique: true },
    password: String,
    type: String,
    firstname: String,
    lastname: String,
    contact_phone: String,
    email: { type: String, unique: true },
    profileImage: { type: String, default: '/default-profile.png' },
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, { versionKey: false });
exports.default = mongoose_1.default.model("User", userSchema, "users");
