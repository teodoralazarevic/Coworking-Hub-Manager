"use strict";
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var user_1 = __importDefault(require("../models/user"));
var company_1 = __importDefault(require("../models/company"));
var reg_request_1 = __importDefault(require("../models/reg_request"));
var crypto_1 = __importDefault(require("crypto"));
var reservation_1 = __importDefault(require("../models/reservation"));
var workspace_1 = __importDefault(require("../models/workspace"));
var workspace_reaction_1 = __importDefault(require("../models/workspace_reaction"));
var comment_1 = __importDefault(require("../models/comment"));
var UserController = /** @class */ (function () {
    function UserController() {
        var _this = this;
        this.loginPublic = function (req, res) {
            var _a = req.body, username = _a.username, password = _a.password;
            user_1.default.findOne({ username: username, type: { $in: ["member", "manager"] } }).then(function (user) {
                if (!user)
                    return res.status(400).json({ message: "Invalid username" });
                // check password
                bcrypt_1.default.compare(password, user.password).then(function (isMatchedPass) {
                    if (!isMatchedPass)
                        return res.status(400).json({ message: "Invalid password" });
                    // send to front without password
                    var _a = user.toObject(), password = _a.password, userWithoutPassword = __rest(_a, ["password"]);
                    return res.status(200).json(userWithoutPassword);
                });
            }).catch(function (err) {
                console.log(err);
                res.status(500).json({ message: "Server error" });
            });
        };
        this.loginPrivate = function (req, res) {
            var _a = req.body, username = _a.username, password = _a.password;
            user_1.default.findOne({ username: username, type: "admin" }).then(function (user) {
                if (!user)
                    return res.status(400).json({ message: "Invalid username" });
                bcrypt_1.default.compare(password, user.password).then(function (isMatchedPass) {
                    if (!isMatchedPass)
                        return res.status(400).json({ message: "Invalid password" });
                    // send to front without password
                    var _a = user.toObject(), password = _a.password, userWithoutPassword = __rest(_a, ["password"]);
                    return res.status(200).json(userWithoutPassword);
                });
            }).catch(function (err) {
                console.log(err);
                res.status(500).json({ message: "Server error" });
            });
        };
        this.register = function (req, res) {
            var user = JSON.parse(req.body.user);
            var company = JSON.parse(req.body.company);
            var username = user.username, password = user.password, type = user.type, firstname = user.firstname, lastname = user.lastname, contact_phone = user.contact_phone, email = user.email;
            var profileImage = req.file;
            var profileImagePath = '/default-profile.png'; // default image
            if (profileImage) {
                profileImagePath = "/uploads/profiles/".concat(profileImage.filename);
            }
            if (!["member", "manager"].includes(type)) {
                return res.status(400).json({ message: "Invalid user type" });
            }
            if (type === "manager") {
                if (!company || !company.company_name || !company.company_address ||
                    !company.reg_number || !company.tax_ident_number) {
                    return res.status(400).json({ message: "All company fields are required for manager registration" });
                }
            }
            user_1.default.findOne({ $or: [{ username: username }, { email: email }] }).then(function (existingUser) {
                if (existingUser) {
                    if (existingUser.username === username)
                        return res.status(400).json({ message: "Username already exists" });
                    if (existingUser.email === email)
                        return res.status(400).json({ message: "Email already exists" });
                }
                reg_request_1.default.findOne({ $or: [{ "userData.username": username }, { "userData.email": email }] }).then(function (existingRequest) {
                    if (existingRequest) {
                        if (existingRequest.userData.username === username) {
                            return res.status(400).json({
                                message: "Pending registration request with this username already exists"
                            });
                        }
                        if (existingRequest.userData.email === email) {
                            return res.status(400).json({
                                message: "Pending registration request with this email already exists"
                            });
                        }
                    }
                    if (type === "manager") {
                        company_1.default.findOne({ reg_number: company.reg_number }).then(function (foundCompany) {
                            if (foundCompany && foundCompany.managers && foundCompany.managers.length >= 2)
                                return res.status(400).json({ message: "Company already has maximum numbers of managers (2)" });
                            bcrypt_1.default.hash(password, 12).then(function (hashedPass) {
                                var newRequest = new reg_request_1.default({
                                    userData: {
                                        username: username,
                                        password: hashedPass,
                                        type: type,
                                        firstname: firstname,
                                        lastname: lastname,
                                        contact_phone: contact_phone,
                                        email: email,
                                        profileImage: profileImagePath
                                    },
                                    companyData: {
                                        company_name: company.company_name,
                                        company_address: company.company_address,
                                        reg_number: company.reg_number,
                                        tax_ident_number: company.tax_ident_number
                                    },
                                });
                                newRequest.save().then(function (saved) {
                                    return res.status(200).json({ message: "Registration request sent! Waiting for admin approval." });
                                }).catch(function (err) {
                                    console.log(err);
                                    return res.status(500).json({ message: "Error saving registration request" });
                                });
                            }).catch(function (err) {
                                console.log(err);
                                return res.status(500).json({ message: "Error hashing password" });
                            });
                        });
                    }
                    else {
                        bcrypt_1.default.hash(password, 12).then(function (hashedPass) {
                            var newRequest = new reg_request_1.default({
                                userData: {
                                    username: username,
                                    password: hashedPass,
                                    type: type,
                                    firstname: firstname,
                                    lastname: lastname,
                                    contact_phone: contact_phone,
                                    email: email,
                                    profileImage: profileImagePath
                                }
                            });
                            newRequest.save().then(function (saved) {
                                return res.status(200).json({ message: "Registration request sent! Waiting for admin approval." });
                            }).catch(function (err) {
                                console.log(err);
                                return res.status(500).json({ message: "Error saving registration request" });
                            });
                        }).catch(function (err) {
                            console.log(err);
                            return res.status(500).json({ message: "Error hashing password" });
                        });
                    }
                });
            }).catch(function (err) {
                console.log(err);
                return res.status(500).json({ message: "Server error" });
            });
        };
        this.pendingMembersRequests = function (req, res) {
            reg_request_1.default.find({ "userData.type": "member" }).then(function (requests) {
                if (!requests)
                    return res.status(400).json({ message: "No data found" });
                return res.status(200).json(requests);
            }).catch(function (err) {
                console.log(err);
                return res.status(500).json({ message: "Server error" });
            });
        };
        this.pendingManagersRequests = function (req, res) {
            reg_request_1.default.find({ "userData.type": "manager" }).then(function (requests) {
                if (!requests)
                    return res.status(400).json({ message: "No data found" });
                return res.status(200).json(requests);
            }).catch(function (err) {
                console.log(err);
                return res.status(500).json({ message: "Server error" });
            });
        };
        this.approveMemberRequest = function (req, res) {
            var user = req.body.userData;
            var requestID = req.body._id;
            var newUser = new user_1.default(user);
            newUser.save().then(function () {
                return reg_request_1.default.findByIdAndDelete(requestID);
            }).then(function () {
                return res.status(200).json({ message: "Request approved!" });
            }).catch(function (err) {
                console.log(err);
                return res.status(500).json({ message: "Error approving request." });
            });
        };
        this.approveManagerRequest = function (req, res) {
            var user = req.body.userData;
            var company = req.body.companyData;
            var requestID = req.body._id;
            var newUser = new user_1.default(user);
            var newCompany = new company_1.default(company);
            // check if company already has two managers (if company exists in system)
            company_1.default.findOne({ reg_number: company.reg_number }).then(function (foundCompany) {
                if (foundCompany && foundCompany.managers.length >= 2)
                    throw { status: 400, message: "Company already has maximum numbers of managers (2)" };
                // if company does not exist, create company and add manager
                if (!foundCompany) {
                    newCompany.managers.push(newUser.username);
                    newCompany.save().then(function () {
                        return newUser.save();
                    });
                }
                else {
                    company_1.default.findOneAndUpdate({ reg_number: company.reg_number }, { $push: { managers: newUser.username } }).then(function () {
                        return newUser.save();
                    });
                }
            }).then(function (ok) {
                return reg_request_1.default.findByIdAndDelete(requestID);
            }).then(function () {
                return res.status(200).json({ message: "Request approved!" });
            }).catch(function (err) {
                if (err.status) {
                    return res.status(err.status).json({ message: err.message });
                }
                console.log(err);
                return res.status(500).json({ message: "Error approving request." });
            });
        };
        this.rejectRequest = function (req, res) {
            var requestID = req.body._id;
            reg_request_1.default.findByIdAndDelete(requestID).then(function () {
                res.status(200).json({ message: "Request rejected!" });
            }).catch(function (err) {
                console.log(err);
                res.status(500).json({ message: "Error rejecting request." });
            });
        };
        this.forgotPassword = function (req, res) {
            var emailOrUsername = req.body.emailOrUsername;
            user_1.default.findOne({ $or: [{ username: emailOrUsername }, { email: emailOrUsername }] }).then(function (user) {
                if (!user)
                    throw { status: 400, message: "User does not exist" };
                var token = crypto_1.default.randomBytes(32).toString("hex");
                user.resetPasswordToken = token;
                user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
                user.save().then(function (ok) {
                    return res.status(200).json({ message: "Reset link generated", token: token });
                });
            }).catch(function (err) {
                if (err.status) {
                    return res.status(err.status).json({ message: err.message });
                }
                console.log(err);
                return res.status(500).json({ message: "Server error" });
            });
        };
        this.resetPassword = function (req, res) {
            var token = req.body.token;
            var newPassword = req.body.password;
            user_1.default.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: new Date() } }).then(function (user) {
                if (!user)
                    throw { status: 400, message: "Token expired or invalid" };
                bcrypt_1.default.hash(newPassword, 12).then(function (hashedPass) {
                    user.password = hashedPass;
                    user.resetPasswordExpires = undefined;
                    user.resetPasswordToken = undefined;
                    user.save().then(function (ok) {
                        return res.status(200).json({ message: "Password updated!" });
                    });
                });
            }).catch(function (err) {
                if (err.status)
                    return res.status(err.status).json({ message: err.message });
                console.log(err);
                return res.status(500).json({ message: "Error while reseting password" });
            });
        };
        this.updateProfileMember = function (req, res) {
            var username = req.body.username;
            var password = req.body.password;
            var firstname = req.body.firstname;
            var lastname = req.body.lastname;
            var contact_phone = req.body.contact_phone;
            var email = req.body.email;
            var profileImage = req.file;
            var profileImagePath = '/default-profile.png'; // default image
            if (profileImage) {
                profileImagePath = "/uploads/profiles/".concat(profileImage.filename);
            }
            user_1.default.findOne({ username: username }).then(function (user) {
                if (!user)
                    throw { status: 400, message: "User not found" };
                var passwordPromise = Promise.resolve();
                if (password) {
                    passwordPromise = bcrypt_1.default.hash(password, 12).then(function (hashedPass) {
                        user.password = hashedPass;
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;
                    });
                }
                var emailPromise = Promise.resolve();
                if (email && email !== user.email) {
                    emailPromise = user_1.default.findOne({ email: email }).then(function (existingUser) {
                        if (existingUser)
                            return Promise.reject({ status: 400, message: "Email already exists" });
                        user.email = email;
                    });
                }
                Promise.all([passwordPromise, emailPromise]).then(function () {
                    if (firstname)
                        user.firstname = firstname;
                    if (lastname)
                        user.lastname = lastname;
                    if (contact_phone)
                        user.contact_phone = contact_phone;
                    if (profileImage)
                        user.profileImage = profileImagePath;
                    user.save().then(function () {
                        return res.status(200).json({ message: "Profile updated successfully" });
                    }).catch(function (err) {
                        console.log(err);
                        return res.status(500).json({ message: "Error saving profile" });
                    });
                }).catch(function (err) {
                    if (err.status)
                        return res.status(err.status).json({ message: err.message });
                    console.log(err);
                    return res.status(500).json({ message: "Error updating profile" });
                });
            }).catch(function (err) {
                if (err.status)
                    return res.status(err.status).json({ message: err.message });
                console.log(err);
                return res.status(500).json({ message: "Error updating profile" });
            });
        };
        this.getUserInfo = function (req, res) {
            var username = req.body.username;
            user_1.default.findOne({ username: username }).then(function (user) {
                res.status(200).json(user);
            }).catch(function (err) {
                console.log(err);
                res.status(400).json(null);
            });
        };
        this.getAllUsers = function (req, res) {
            user_1.default.find({ type: { $ne: "admin" } }).then(function (users) {
                return res.status(200).json(users);
            }).catch(function (err) {
                console.log(err);
                return res.status(500).json(null);
            });
        };
        this.deleteUser = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var username, user, managerWorkspaces, _i, managerWorkspaces_1, ws, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 16, , 17]);
                        username = req.body.username;
                        return [4 /*yield*/, user_1.default.findOne({ username: username })];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/, res.status(404).json({ message: 'User not found' })];
                        if (!(user.type === 'manager')) return [3 /*break*/, 11];
                        return [4 /*yield*/, workspace_1.default.find({ manager: username })];
                    case 2:
                        managerWorkspaces = _a.sent();
                        _i = 0, managerWorkspaces_1 = managerWorkspaces;
                        _a.label = 3;
                    case 3:
                        if (!(_i < managerWorkspaces_1.length)) return [3 /*break*/, 8];
                        ws = managerWorkspaces_1[_i];
                        return [4 /*yield*/, comment_1.default.deleteMany({ workspace: ws._id })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, reservation_1.default.deleteMany({ workspace: ws._id })];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, workspace_reaction_1.default.deleteMany({ workspace: ws._id })];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 3];
                    case 8: return [4 /*yield*/, workspace_1.default.deleteMany({ manager: username })];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, company_1.default.updateMany({ managers: username }, { $pull: { managers: username } })];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: return [4 /*yield*/, reservation_1.default.deleteMany({ user: user._id })];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, comment_1.default.deleteMany({ user: user._id })];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, workspace_reaction_1.default.deleteMany({ user: user._id })];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, user_1.default.deleteOne({ _id: user._id })];
                    case 15:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({ message: 'User and all related data deleted successfully' })];
                    case 16:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [2 /*return*/, res.status(500).json({ message: 'Server error' })];
                    case 17: return [2 /*return*/];
                }
            });
        }); };
        this.updateUser = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var updateData, user, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        updateData = req.body;
                        return [4 /*yield*/, user_1.default.findOne({ username: updateData.username })];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                        user.firstname = updateData.firstname;
                        user.lastname = updateData.lastname;
                        user.contact_phone = updateData.contact_phone;
                        user.email = updateData.email;
                        user.type = updateData.type;
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({ message: "User updated successfully" })];
                    case 3:
                        err_2 = _a.sent();
                        console.error(err_2);
                        return [2 /*return*/, res.status(500).json({ message: "Server error" })];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
    }
    return UserController;
}());
exports.UserController = UserController;
