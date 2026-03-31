"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var reservation_controller_1 = require("../controllers/reservation.controller");
var reservationRouter = express_1.default.Router();
reservationRouter.route("/createReservation").post(function (req, res) { return new reservation_controller_1.ReservationController().createReservation(req, res); });
reservationRouter.route("/getReservationsForRoom").post(function (req, res) { return new reservation_controller_1.ReservationController().getReservationsForRoom(req, res); });
reservationRouter.route("/getUserReservations").post(function (req, res) { return new reservation_controller_1.ReservationController().getUserReservations(req, res); });
reservationRouter.route("/cancelReservation").post(function (req, res) { return new reservation_controller_1.ReservationController().cancelReservation(req, res); });
reservationRouter.route("/getManagerReservations").post(function (req, res) { return new reservation_controller_1.ReservationController().getManagerReservations(req, res); });
reservationRouter.route("/clientShowedUp").post(function (req, res) { return new reservation_controller_1.ReservationController().clientShowedUp(req, res); });
reservationRouter.route("/clientCanReserveWorkspace").post(function (req, res) { return new reservation_controller_1.ReservationController().clientCanReserveWorkspace(req, res); });
reservationRouter.route("/checkRoomAvailability").post(function (req, res) { return new reservation_controller_1.ReservationController().checkRoomAvailability(req, res); });
reservationRouter.route("/rescheduleReservation").post(function (req, res) { return new reservation_controller_1.ReservationController().rescheduleReservation(req, res); });
reservationRouter.route("/getAllReservations").get(function (req, res) { return new reservation_controller_1.ReservationController().getAllReservations(req, res); });
exports.default = reservationRouter;
