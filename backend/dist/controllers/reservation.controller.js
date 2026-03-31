"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationController = void 0;
var reservation_1 = __importStar(require("../models/reservation"));
var user_1 = __importDefault(require("../models/user"));
var workspace_1 = __importDefault(require("../models/workspace"));
var ReservationController = /** @class */ (function () {
    function ReservationController() {
        var _this = this;
        this.createReservation = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var reservation, start, end, conflict, newReservation, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reservation = req.body;
                        start = new Date("".concat(reservation.date, "T").concat(reservation.startTime, ":00"));
                        end = new Date("".concat(reservation.date, "T").concat(reservation.endTime, ":00"));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        if (end <= start)
                            return [2 /*return*/, res.status(400).json({ message: "End time must be after start time" })];
                        return [4 /*yield*/, reservation_1.default.findOne({
                                workspace: reservation.workspace,
                                spaceName: reservation.spaceName,
                                status: { $in: [reservation_1.ReservationStatus.RESERVED, reservation_1.ReservationStatus.COMPLETED] },
                                $or: [
                                    { start: { $lt: end, $gte: start } },
                                    { end: { $gt: start, $lte: end } },
                                    { start: { $lt: start }, end: { $gte: end } }
                                ]
                            })];
                    case 2:
                        conflict = _a.sent();
                        if (conflict)
                            return [2 /*return*/, res.status(400).json({ message: "Selected time slot is already reserved" })];
                        newReservation = new reservation_1.default({
                            user: reservation.user,
                            workspace: reservation.workspace,
                            spaceName: reservation.spaceName,
                            status: reservation_1.ReservationStatus.RESERVED,
                            startTime: start,
                            endTime: end
                        });
                        return [4 /*yield*/, newReservation.save()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({ message: "Reservation successfull" })];
                    case 4:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [2 /*return*/, res.status(500).json({ message: "Server error" })];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.getReservationsForRoom = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, workspaceID, spaceName, start, end, startDate, endDate, reservations, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, workspaceID = _a.workspaceID, spaceName = _a.spaceName, start = _a.start, end = _a.end;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        startDate = new Date(start);
                        endDate = new Date(end);
                        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                            return [2 /*return*/, res.status(400).json({ message: 'Invalid date format' })];
                        }
                        reservations = [];
                        if (!(spaceName === '')) return [3 /*break*/, 3];
                        return [4 /*yield*/, reservation_1.default.find({
                                workspace: workspaceID,
                                $or: [
                                    { startTime: { $lt: endDate }, endTime: { $gt: startDate } } // preklapanje intervala
                                ],
                                status: { $in: [reservation_1.ReservationStatus.RESERVED, reservation_1.ReservationStatus.COMPLETED] }
                            }).populate('user')];
                    case 2:
                        reservations = _b.sent(); // to get user object
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, reservation_1.default.find({
                            workspace: workspaceID,
                            spaceName: spaceName,
                            $or: [
                                { startTime: { $lt: endDate }, endTime: { $gt: startDate } } // preklapanje intervala
                            ],
                            status: { $in: [reservation_1.ReservationStatus.RESERVED, reservation_1.ReservationStatus.COMPLETED] }
                        }).populate('user')];
                    case 4:
                        reservations = _b.sent(); // to get user object
                        _b.label = 5;
                    case 5:
                        res.json(reservations);
                        return [3 /*break*/, 7];
                    case 6:
                        err_2 = _b.sent();
                        console.error(err_2);
                        res.status(500).json({ message: 'Server error' });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        this.getUserReservations = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var username, user, reservations, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        username = req.body.username;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, user_1.default.findOne({ username: username })];
                    case 2:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/, res.status(400).json({ message: "User does not exist" })];
                        return [4 /*yield*/, reservation_1.default.find({ user: user._id }).populate('workspace')];
                    case 3:
                        reservations = _a.sent();
                        return [2 /*return*/, res.status(200).json(reservations)];
                    case 4:
                        err_3 = _a.sent();
                        console.log(err_3);
                        return [2 /*return*/, res.status(500).json({ message: "Server error" })];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.cancelReservation = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var reservationID, reservation, now, startTime, diffMs, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        reservationID = req.body._id;
                        return [4 /*yield*/, reservation_1.default.findById(reservationID)];
                    case 1:
                        reservation = _a.sent();
                        if (!reservation) {
                            return [2 /*return*/, res.status(400).json({ message: 'Reservation not found' })];
                        }
                        now = new Date();
                        startTime = new Date(reservation.startTime);
                        diffMs = startTime.getTime() - now.getTime();
                        if (diffMs < ReservationController.lateForCancel) {
                            return [2 /*return*/, res.status(400).json({ message: 'Cannot cancel reservation less than 12 hours before start' })];
                        }
                        reservation.status = reservation_1.ReservationStatus.CANCELLED;
                        return [4 /*yield*/, reservation.save()];
                    case 2:
                        _a.sent();
                        res.json({ message: 'Reservation cancelled successfully', reservation: reservation });
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        console.log(err_4);
                        return [2 /*return*/, res.status(500).json({ message: "Server error" })];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.getManagerReservations = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var username, workspaces, workspaceIds, reservations, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        username = req.body.username;
                        return [4 /*yield*/, workspace_1.default.find({ manager: username })];
                    case 1:
                        workspaces = _a.sent();
                        if (!workspaces) {
                            return [2 /*return*/, res.status(400).json({ message: "No workspaces found for this manager." })];
                        }
                        workspaceIds = workspaces.map(function (ws) { return ws._id; });
                        return [4 /*yield*/, reservation_1.default.find({ workspace: { $in: workspaceIds }, status: 'reserved' }).
                                populate('user').populate('workspace')];
                    case 2:
                        reservations = _a.sent();
                        return [2 /*return*/, res.status(200).json(reservations)];
                    case 3:
                        err_5 = _a.sent();
                        console.log(err_5);
                        return [2 /*return*/, res.status(500).json({ message: "Server error" })];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.clientShowedUp = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, reservationID, showed, newStatus, updatedReservation, err_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, reservationID = _a.reservationID, showed = _a.showed;
                        newStatus = showed ? reservation_1.ReservationStatus.COMPLETED : reservation_1.ReservationStatus.NO_SHOW;
                        return [4 /*yield*/, reservation_1.default.findByIdAndUpdate(reservationID, { status: newStatus })];
                    case 1:
                        updatedReservation = _b.sent();
                        if (!updatedReservation) {
                            return [2 /*return*/, res.status(400).json({ message: "Reservation not found" })];
                        }
                        return [2 /*return*/, res.status(200).json({ message: "Reservation status updated" })];
                    case 2:
                        err_6 = _b.sent();
                        console.log(err_6);
                        return [2 /*return*/, res.status(500).json({ message: "Server error" })];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.clientCanReserveWorkspace = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, workspaceID, username, workspace, maxPenaltyPoints, user, noShowCount, err_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        _a = req.body, workspaceID = _a.workspaceID, username = _a.username;
                        return [4 /*yield*/, workspace_1.default.findById(workspaceID)];
                    case 1:
                        workspace = _b.sent();
                        if (!workspace)
                            return [2 /*return*/, res.status(400).json({ message: "Workspace not found" })];
                        maxPenaltyPoints = workspace.penaltyPoints;
                        return [4 /*yield*/, user_1.default.findOne({ username: username })];
                    case 2:
                        user = _b.sent();
                        if (!user) {
                            return [2 /*return*/, res.status(400).json({ message: "User not found" })];
                        }
                        return [4 /*yield*/, reservation_1.default.countDocuments({
                                user: user._id,
                                workspace: workspace._id,
                                status: 'no_show'
                            })];
                    case 3:
                        noShowCount = _b.sent();
                        if (noShowCount >= maxPenaltyPoints) {
                            return [2 /*return*/, res.status(400).json(false)];
                        }
                        return [2 /*return*/, res.status(200).json(true)];
                    case 4:
                        err_7 = _b.sent();
                        console.log(err_7);
                        return [2 /*return*/, res.status(500).json({ message: "Server error" })];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.checkRoomAvailability = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, workspaceId, roomName_1, start, end, exclude, startTime, endTime, workspace, roomExists, query, overlappingReservation, err_8;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        _a = req.body, workspaceId = _a.workspaceId, roomName_1 = _a.roomName, start = _a.start, end = _a.end, exclude = _a.exclude;
                        if (!start || !end) {
                            return [2 /*return*/, res.status(400).json({ message: 'Start and end times are required' })];
                        }
                        startTime = new Date(start);
                        endTime = new Date(end);
                        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
                            return [2 /*return*/, res.status(400).json({ message: 'Invalid date format' })];
                        }
                        if (endTime <= startTime) {
                            return [2 /*return*/, res.status(400).json({ message: 'End time must be after start time' })];
                        }
                        return [4 /*yield*/, workspace_1.default.findById(workspaceId)];
                    case 1:
                        workspace = _d.sent();
                        if (!workspace) {
                            return [2 /*return*/, res.status(404).json({ message: 'Workspace not found' })];
                        }
                        roomExists = false;
                        if (workspace.openSpace && workspace.openSpace.name === roomName_1) {
                            roomExists = true;
                        }
                        else if ((_b = workspace.offices) === null || _b === void 0 ? void 0 : _b.some(function (office) { return office.name === roomName_1; })) {
                            roomExists = true;
                        }
                        else if ((_c = workspace.confRooms) === null || _c === void 0 ? void 0 : _c.some(function (room) { return room.name === roomName_1; })) {
                            roomExists = true;
                        }
                        if (!roomExists) {
                            return [2 /*return*/, res.status(404).json({ message: 'Room not found in this workspace' })];
                        }
                        query = {
                            workspace: workspaceId,
                            spaceName: roomName_1,
                            status: { $ne: 'CANCELLED' },
                            $or: [
                                {
                                    // overlaping reservations
                                    startTime: { $lt: endTime },
                                    endTime: { $gt: startTime }
                                }
                            ]
                        };
                        if (exclude) {
                            query._id = { $ne: exclude };
                        }
                        return [4 /*yield*/, reservation_1.default.findOne(query)];
                    case 2:
                        overlappingReservation = _d.sent();
                        res.status(200).json(!overlappingReservation);
                        return [3 /*break*/, 4];
                    case 3:
                        err_8 = _d.sent();
                        console.error('Error checking room availability:', err_8);
                        res.status(500).json({ message: 'Server error' });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.rescheduleReservation = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, reservationId, startTime, endTime, newStartTime, newEndTime, reservation, overlappingReservation, err_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        _a = req.body, reservationId = _a.reservationId, startTime = _a.startTime, endTime = _a.endTime;
                        if (!startTime || !endTime) {
                            return [2 /*return*/, res.status(400).json({ message: 'Start time and end time are required' })];
                        }
                        newStartTime = new Date(startTime);
                        newEndTime = new Date(endTime);
                        if (isNaN(newStartTime.getTime()) || isNaN(newEndTime.getTime())) {
                            return [2 /*return*/, res.status(400).json({ message: 'Invalid date format' })];
                        }
                        if (newEndTime <= newStartTime) {
                            return [2 /*return*/, res.status(400).json({ message: 'End time must be after start time' })];
                        }
                        return [4 /*yield*/, reservation_1.default.findById(reservationId)];
                    case 1:
                        reservation = _b.sent();
                        if (!reservation) {
                            return [2 /*return*/, res.status(404).json({ message: 'Reservation not found' })];
                        }
                        return [4 /*yield*/, reservation_1.default.findOne({
                                workspace: reservation.workspace,
                                spaceName: reservation.spaceName,
                                _id: { $ne: reservationId },
                                status: { $ne: 'CANCELLED' },
                                $or: [
                                    {
                                        startTime: { $lt: newEndTime },
                                        endTime: { $gt: newStartTime }
                                    }
                                ]
                            })];
                    case 2:
                        overlappingReservation = _b.sent();
                        if (overlappingReservation) {
                            return [2 /*return*/, res.status(409).json({ message: 'Selected time slot is not available' })];
                        }
                        reservation.startTime = newStartTime;
                        reservation.endTime = newEndTime;
                        return [4 /*yield*/, reservation.save()];
                    case 3:
                        _b.sent();
                        res.status(200).json({
                            message: 'Reservation rescheduled successfully',
                            reservation: reservation
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        err_9 = _b.sent();
                        console.error('Error rescheduling reservation:', err_9);
                        res.status(500).json({ message: 'Server error' });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.getAllReservations = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var reservations, err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, reservation_1.default.find().populate('workspace')];
                    case 1:
                        reservations = _a.sent();
                        res.status(200).json(reservations);
                        return [3 /*break*/, 3];
                    case 2:
                        err_10 = _a.sent();
                        console.log(err_10);
                        res.status(500).json({ message: "Server error" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
    }
    // when its late to cancel reservation
    ReservationController.lateForCancel = 12 * 60 * 60 * 1000;
    return ReservationController;
}());
exports.ReservationController = ReservationController;
