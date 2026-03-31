"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
var company_1 = __importDefault(require("../models/company"));
var workspace_1 = __importDefault(require("../models/workspace"));
var CompanyController = /** @class */ (function () {
    function CompanyController() {
        this.getCompany = function (req, res) {
            var manager = req.body.manager;
            company_1.default.findOne({ managers: manager }).then(function (company) {
                if (!company)
                    return res.status(400).json(null);
                return res.status(200).json(company);
            }).catch(function (err) {
                console.log(err);
                return res.status(500).json(null);
            });
        };
        this.getWorkspaces = function (req, res) {
            var company = req.body;
            var companyID = company._id;
            workspace_1.default.find({ company: companyID }).then(function (ws) {
                return res.status(200).json(ws);
            }).catch(function (err) {
                console.log(err);
                return res.status(500).json(null);
            });
        };
    }
    return CompanyController;
}());
exports.CompanyController = CompanyController;
