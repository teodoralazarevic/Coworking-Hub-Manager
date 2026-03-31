"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var companySchema = new mongoose_1.default.Schema({
    company_name: String,
    company_address: String,
    reg_number: String,
    tax_ident_number: String, // PIB
    managers: Array
}, { versionKey: false });
exports.default = mongoose_1.default.model("Company", companySchema, "companies");
