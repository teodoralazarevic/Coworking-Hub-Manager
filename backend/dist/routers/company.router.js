"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var company_controller_1 = require("../controllers/company.controller");
var companyRouter = express_1.default.Router();
companyRouter.route("/getCompany").post(function (req, res) { return new company_controller_1.CompanyController().getCompany(req, res); });
companyRouter.route("/getWorkspaces").post(function (req, res) { return new company_controller_1.CompanyController().getWorkspaces(req, res); });
exports.default = companyRouter;
