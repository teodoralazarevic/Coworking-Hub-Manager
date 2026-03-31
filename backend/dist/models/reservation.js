"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationStatus = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
exports.ReservationStatus = {
    RESERVED: 'reserved',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show'
};
var reservationSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    workspace: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    spaceName: String,
    status: {
        type: String,
        enum: Object.values(exports.ReservationStatus)
    },
    startTime: Date,
    endTime: Date
}, { versionKey: false });
exports.default = mongoose_1.default.model("Reservation", reservationSchema, "reservations");
