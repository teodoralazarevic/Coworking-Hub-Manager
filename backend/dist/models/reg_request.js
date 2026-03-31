"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var userDataSchema = new mongoose_1.default.Schema({
    username: String,
    password: String,
    type: String,
    firstname: String,
    lastname: String,
    contact_phone: String,
    email: String,
    profileImage: { type: String, default: '/default-profile.png' }
}, { _id: false });
var companyDataSchema = new mongoose_1.default.Schema({
    company_name: String,
    company_address: String,
    reg_number: String,
    tax_ident_number: String, // PIB
    managers: Array
}, { _id: false });
var regReqSchema = new mongoose_1.default.Schema({
    userData: { type: userDataSchema, required: true },
    companyData: { type: companyDataSchema, required: function () { return this.userData.type === 'manager'; } }
}, { versionKey: false });
exports.default = mongoose_1.default.model("RegistrationRequest", regReqSchema, "reg_requests");
