"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user_controller_1 = require("../controllers/user.controller");
var upload_1 = require("../middleware/upload");
var userRouter = express_1.default.Router();
userRouter.route("/login-public").post(function (req, res) { return new user_controller_1.UserController().loginPublic(req, res); });
userRouter.route("/login-private").post(function (req, res) { return new user_controller_1.UserController().loginPrivate(req, res); });
userRouter.route("/pendingRegistrationRequestsMember").get(function (req, res) { return new user_controller_1.UserController().pendingMembersRequests(req, res); });
userRouter.route("/pendingRegistrationRequestsManagers").get(function (req, res) { return new user_controller_1.UserController().pendingManagersRequests(req, res); });
userRouter.route("/approveMemberRequest").post(function (req, res) { return new user_controller_1.UserController().approveMemberRequest(req, res); });
userRouter.route("/rejectRequest").post(function (req, res) { return new user_controller_1.UserController().rejectRequest(req, res); });
userRouter.route("/approveManagerRequest").post(function (req, res) { return new user_controller_1.UserController().approveManagerRequest(req, res); });
userRouter.route("/register").post(upload_1.uploadUserPhotos.single('profileImage'), function (req, res) {
    new user_controller_1.UserController().register(req, res);
});
userRouter.route("/forgotPassword").post(function (req, res) { return new user_controller_1.UserController().forgotPassword(req, res); });
userRouter.route("/resetPassword").post(function (req, res) { return new user_controller_1.UserController().resetPassword(req, res); });
userRouter.route("/updateProfileMember").post(upload_1.uploadUserPhotos.single('profileImage'), function (req, res) { return new user_controller_1.UserController().updateProfileMember(req, res); });
userRouter.route("/getUserInfo").post(function (req, res) { return new user_controller_1.UserController().getUserInfo(req, res); });
userRouter.route("/allUsers").get(function (req, res) { return new user_controller_1.UserController().getAllUsers(req, res); });
userRouter.route("/deleteUser").post(function (req, res) { return new user_controller_1.UserController().deleteUser(req, res); });
userRouter.route("/updateUser").post(function (req, res) { return new user_controller_1.UserController().updateUser(req, res); });
exports.default = userRouter;
